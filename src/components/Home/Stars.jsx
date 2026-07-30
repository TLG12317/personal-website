export default function Stars({ stars, starsVisible, scene }) {
    return (
        <div
            className={`stars ${
                starsVisible ? "stars-in" : ""
            } ${scene === "house" ? "stars-settled" : ""}`}
        >
            {stars.map((s, idx) => (
                <span
                    key={idx}
                    className="star"
                    style={{
                        top: s.top,
                        left: s.left,
                        animationDelay: s.delay,
                        animationDuration: s.duration,
                    }}
                />
            ))}
        </div>
    );
}