export default function ContentBlockEditor({
    block,
    index,
    isFirst,
    isLast,
    onChangeValue,
    onChangeSrc,
    onUploadImage,
    onMoveUp,
    onMoveDown,
    onDelete
}) {

    return (

        <div className="content-block">

            {block.type === "paragraph" && (

                <>
                    <label>Paragraph</label>

                    <textarea
                        value={block.value}
                        onChange={(e) => onChangeValue(index, e.target.value)}
                    />
                </>

            )}

            {block.type === "image" && (

                <>
                    <label>Upload Image</label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files[0]) {
                                onUploadImage(e.target.files[0], index);
                            }
                        }}
                    />

                    <label>Image URL</label>

                    <input
                        value={block.src || ""}
                        onChange={(e) => onChangeSrc(index, e.target.value)}
                    />
                </>

            )}

            <div className="block-controls">

                <button
                    type="button"
                    disabled={isFirst}
                    onClick={() => onMoveUp(index)}
                >
                    ↑
                </button>

                <button
                    type="button"
                    disabled={isLast}
                    onClick={() => onMoveDown(index)}
                >
                    ↓
                </button>

            </div>

            <button
                type="button"
                onClick={() => onDelete(index)}
            >
                Delete Block
            </button>

        </div>

    );

}
