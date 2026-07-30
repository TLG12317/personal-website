export default function Rain({ raindrops }) {
    return (
        <div className="rain">
            {raindrops.map((r, idx) => (
                <span
                    key={idx}
                    className="raindrop"
                    style={{
                        left: r.left,
                        height: r.height,
                        animationDelay: r.delay,
                        animationDuration: r.duration,
                    }}
                />
            ))}
        </div>
    );
}