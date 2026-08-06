export default function EditorPreview({ content }) {

    return (

        <div className="editor-preview">

            <h3>Preview</h3>

            {content.map((block, index) => {

                if (block.type === "paragraph") {
                    return <p key={block.id ?? index}>{block.value}</p>;
                }

                if (block.type === "image") {

                    return block.src ? (

                        <img
                            key={block.id ?? index}
                            src={block.src}
                            alt=""
                        />

                    ) : (

                        <div
                            key={block.id ?? index}
                            className="editor-preview-placeholder"
                        >
                            No image selected
                        </div>

                    );

                }

                return null;

            })}

        </div>

    );

}
