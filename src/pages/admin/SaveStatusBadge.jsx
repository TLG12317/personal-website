function formatSaveStatus(status, lastSaved) {

    if (status === "saving") return "Saving...";
    if (status === "unsaved") return "Unsaved changes";

    if (lastSaved) {
        return `Saved ${lastSaved.toLocaleTimeString()}`;
    }

    return "Saved ✓";

}

export default function SaveStatusBadge({ status, lastSaved }) {

    return (
        <span className={status}>
            {formatSaveStatus(status, lastSaved)}
        </span>
    );

}
