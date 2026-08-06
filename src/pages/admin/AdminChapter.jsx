import { Link, useParams } from "react-router-dom";

import useChapterEditor from "./useChapterEditor";
import ContentBlockEditor from "./ContentBlockEditor";
import EditorPreview from "./EditorPreview";
import SaveStatusBadge from "./SaveStatusBadge";

import "./AdminChapter.css";


export default function AdminChapter() {

    const { id } = useParams();

    const {
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
    } = useChapterEditor(id);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    if (loadError || !chapter) {
        return <h1>Chapter not found.</h1>;
    }

    return (

        <div className="admin-chapter">

            <Link to={`/admin/books/${chapter.book_id}`}>
                ← Back to Book
            </Link>

            <h1>
                Edit Chapter
            </h1>

            <label>
                Title
            </label>

            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <label>
                Slug
            </label>

            <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
            />

            <label>
                Cover
            </label>

            <input
                value={cover}
                onChange={(e) => setCover(e.target.value)}
            />

            <div className="content-header">

                <label>
                    Content
                </label>

                <div className="editor-info">

                    <span>
                        Words: {wordCount}
                    </span>

                    <SaveStatusBadge
                        status={saveStatus}
                        lastSaved={lastSaved}
                    />

                </div>

            </div>

            <div className="chapter-editor">

                <div className="editor-write">

                    <h3>Editor</h3>

                    {content.map((block, index) => (

                        <ContentBlockEditor
                            key={block.id}
                            block={block}
                            index={index}
                            isFirst={index === 0}
                            isLast={index === content.length - 1}
                            onChangeValue={updateBlockValue}
                            onChangeSrc={updateBlockSrc}
                            onUploadImage={uploadImage}
                            onMoveUp={moveBlockUp}
                            onMoveDown={moveBlockDown}
                            onDelete={removeBlock}
                        />

                    ))}

                    <div className="block-buttons">

                        <button
                            type="button"
                            onClick={() => addBlock("paragraph")}
                        >
                            + Paragraph
                        </button>

                        <button
                            type="button"
                            onClick={() => addBlock("image")}
                        >
                            + Image
                        </button>

                    </div>

                </div>

                <EditorPreview content={content} />

            </div>

            <label>
                Status
            </label>

            <div className={`status-badge ${publishStatus}`}>

                {publishStatus === "published"
                    ? "Published"
                    : "Draft"}

            </div>

            <select
                value={publishStatus}
                onChange={(e) => setPublishStatus(e.target.value)}
            >

                <option value="draft">
                    Draft
                </option>

                <option value="published">
                    Published
                </option>

            </select>

            <div className="chapter-actions">

                <button
                    type="button"
                    onClick={save}
                >
                    Save Chapter
                </button>

                <button
                    type="button"
                    className="publish-button"
                    onClick={publish}
                >
                    Publish Chapter
                </button>

                <Link
                    className="preview-button"
                    to={
                        book
                            ? `/books/${book.slug}/${chapter.slug}`
                            : "#"
                    }
                    target="_blank"
                >
                    Preview Chapter
                </Link>

            </div>

        </div>

    );

}
