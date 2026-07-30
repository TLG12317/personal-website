export default function SigrunaTitle({
    text,
    radius,
    step,
    introFinished,
}) {
  return (
    <h1 className="sigruna-arc">
      {text.split("").map((ch, idx) => {
        const mid = (text.length - 1) / 2;
        const angle = (idx - mid) * step;

        return (
          <span
            key={idx}
            className="sigruna-letter"
            style={{
              transform: `translateX(-50%) rotate(${angle}deg) translateY(-${radius}px)`,
              animationDelay: `${0.8 + idx * 0.3}s, ${4 + idx * 0.3}s`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </h1>
  );
}