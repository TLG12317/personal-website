import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
    getAdminChapter,
    updateChapter,
    getAdminBook
} from "../../api/admin";
import { supabase } from "../../supabase";

const AUTOSAVE_DELAY_MS = 1500;
const SAVE_RETRY_DELAY_MS = 500;

let idCounter = 0;

function makeBlockId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    idCounter += 1;
    return `block-${Date.now()}-${idCounter}`;
}

// Ensures every block has a stable id (for React keys that survive
// reordering) even if the data came from the server without one.
function normalizeContent(raw) {

    if (Array.isArray(raw)) {
        return raw.map(block => ({
            id: block.id ?? makeBlockId(),
            ...block
        }));
    }

    return [{
        id: makeBlockId(),
        type: "paragraph",
        value: raw || ""
    }];

}

function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export default function useChapterEditor(id) {

    const [chapter, setChapter] = useState(null);
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    const [title, setTitleState] = useState("");
    const [slug, setSlug] = useState("");
    const [cover, setCover] = useState("");
    const [content, setContent] = useState(() => normalizeContent(null));
    const [publishStatus, setPublishStatus] = useState("draft");

    const [saveStatus, setSaveStatus] = useState("saved");
    const [lastSaved, setLastSaved] = useState(null);

    const saveTimerRef = useRef(null);
    const isSavingRef = useRef(false);

    // When true, the next autosave-effect run is the one caused by
    // loading server data in — not a real user edit — so it's skipped.
    const skipNextAutosaveRef = useRef(true);

    const latestRef = useRef({});
    latestRef.current = { chapter, slug, title, content, cover, publishStatus };

    // ---- Load chapter + its parent book ----
    useEffect(() => {

        let cancelled = false;

        clearTimeout(saveTimerRef.current);
        skipNextAutosaveRef.current = true;

        setLoading(true);
        setLoadError(null);

        getAdminChapter(id)
            .then(data => {

                if (cancelled) return;

                setChapter(data);
                setSlug(data.slug || "");
                setTitleState(data.title || "");
                setContent(normalizeContent(data.content));
                setCover(data.cover || "");
                setPublishStatus(data.publish_status || "draft");
                setLoading(false);

                getAdminBook(data.book_id)
                    .then(b => { if (!cancelled) setBook(b); })
                    .catch(() => { if (!cancelled) setBook(null); });

            })
            .catch(err => {
                if (cancelled) return;
                console.error(err);
                setLoadError(err);
                setLoading(false);
            });

        return () => { cancelled = true; };

    }, [id]);

    const saveChapter = useCallback(async (overrides = {}) => {

        const current = latestRef.current;

        if (!current.chapter) return;

        if (isSavingRef.current) {
            // A save is already in flight — try again shortly rather
            // than firing an overlapping request with stale data.
            saveTimerRef.current = setTimeout(
                () => saveChapter(overrides),
                SAVE_RETRY_DELAY_MS
            );
            return;
        }

        isSavingRef.current = true;
        setSaveStatus("saving");

        try {

            const updated = await updateChapter(id, {
                number: current.chapter.number,
                slug: current.slug,
                title: current.title,
                content: current.content,
                cover: current.cover,
                publish_status: current.publishStatus,
                ...overrides
            });

            setChapter(updated);
            setSaveStatus("saved");
            setLastSaved(new Date());

        } catch (err) {

            console.error(err);
            setSaveStatus("unsaved");

        } finally {

            isSavingRef.current = false;

        }

    }, [id]);

    // ---- Debounced autosave on edits ----
    useEffect(() => {

        if (!chapter) return;

        if (skipNextAutosaveRef.current) {
            skipNextAutosaveRef.current = false;
            return;
        }

        setSaveStatus("unsaved");

        clearTimeout(saveTimerRef.current);

        saveTimerRef.current = setTimeout(() => {
            saveChapter();
        }, AUTOSAVE_DELAY_MS);

        return () => clearTimeout(saveTimerRef.current);

    }, [content, title, slug, cover, publishStatus, chapter, saveChapter]);

    const save = useCallback(() => {
        clearTimeout(saveTimerRef.current);
        return saveChapter();
    }, [saveChapter]);

    const publish = useCallback(() => {
        clearTimeout(saveTimerRef.current);
        setPublishStatus("published");
        return saveChapter({ publish_status: "published" });
    }, [saveChapter]);

    const setTitle = useCallback((value) => {

        setTitleState(value);

        setSlug(prevSlug => {
            const wasAutoGenerated = !prevSlug || prevSlug === slugify(title);
            return wasAutoGenerated ? slugify(value) : prevSlug;
        });

    }, [title]);

    const updateBlockValue = useCallback((index, value) => {
        setContent(prev => prev.map((block, i) =>
            i === index ? { ...block, value } : block
        ));
    }, []);

    const updateBlockSrc = useCallback((index, src) => {
        setContent(prev => prev.map((block, i) =>
            i === index ? { ...block, src } : block
        ));
    }, []);

    const addBlock = useCallback((type) => {
        setContent(prev => [
            ...prev,
            type === "image"
                ? { id: makeBlockId(), type: "image", src: "" }
                : { id: makeBlockId(), type: "paragraph", value: "" }
        ]);
    }, []);

    const removeBlock = useCallback((index) => {
        setContent(prev =>
            prev.length === 1
                ? [{ id: makeBlockId(), type: "paragraph", value: "" }]
                : prev.filter((_, i) => i !== index)
        );
    }, []);

    const moveBlockUp = useCallback((index) => {
        if (index === 0) return;
        setContent(prev => {
            const updated = [...prev];
            [updated[index - 1], updated[index]] =
                [updated[index], updated[index - 1]];
            return updated;
        });
    }, []);

    const moveBlockDown = useCallback((index) => {
        setContent(prev => {
            if (index === prev.length - 1) return prev;
            const updated = [...prev];
            [updated[index], updated[index + 1]] =
                [updated[index + 1], updated[index]];
            return updated;
        });
    }, []);

    const uploadImage = useCallback(async (file, index) => {

        const filename = `${Date.now()}-${file.name}`;

        setSaveStatus("saving");

        const { error } = await supabase.storage
            .from("chapter-images")
            .upload(filename, file);

        if (error) {
            alert(error.message);
            setSaveStatus("unsaved");
            return;
        }

        const { data } = supabase.storage
            .from("chapter-images")
            .getPublicUrl(filename);

        updateBlockSrc(index, data.publicUrl);

    }, [updateBlockSrc]);

    const wordCount = useMemo(() => {
        return content
            .filter(block => block.type === "paragraph")
            .flatMap(block => (block.value || "").split(/\s+/))
            .filter(Boolean)
            .length;
    }, [content]);

    return {
        chapter,
        book,
        loading,
        loadError,

        title,
        slug,
        cover,
        content,
        publishStatus,
        wordCount,

        saveStatus,
        lastSaved,

        setTitle,
        setSlug,
        setCover,
        setPublishStatus,

        updateBlockValue,
        updateBlockSrc,
        addBlock,
        removeBlock,
        moveBlockUp,
        moveBlockDown,
        uploadImage,

        save,
        publish
    };

}
