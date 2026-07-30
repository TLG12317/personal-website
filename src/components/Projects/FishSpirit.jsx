import { useEffect, useRef } from "react";
import fishSrc from "../../assets/fish.png";

export default function FishSpirit() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const fishImg = new Image();
    fishImg.src = fishSrc;

    let animId;

    const START = { x: 0, y: 0 };
    const END = { x: 0, y: 0 };

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // START is set beyond the right edge of the screen
      START.x = canvas.width + 150;
      START.y = canvas.height / 2;

      // END is set beyond the left edge of the screen
      END.x = -150;
      END.y = canvas.height / 2;
    }

    resize();
    window.addEventListener("resize", resize);

    const fish = {
      progress: 0,
      x: START.x,
      y: START.y,
    };

    const DURATION = 12; // Seconds to cross the full screen
    const FISH_WIDTH = 100;
    const FISH_HEIGHT = 100;

    let last = performance.now();

    function animate(now) {
      const dt = (now - last) / 1000;
      last = now;

      fish.progress += dt / DURATION;

      // Loop back to beyond the right edge once off the left side
      if (fish.progress >= 1) {
        fish.progress = 0;
      }

      // Linear interpolation across screen
      fish.x = START.x + (END.x - START.x) * fish.progress;
      fish.y = START.y + (END.y - START.y) * fish.progress;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.shadowColor = "#7dffc9";
      ctx.shadowBlur = 15;

      if (fishImg.complete && fishImg.naturalWidth !== 0) {
        ctx.drawImage(
          fishImg,
          fish.x - FISH_WIDTH / 2,
          fish.y - FISH_HEIGHT / 2,
          FISH_WIDTH,
          FISH_HEIGHT
        );
      }

      animId = requestAnimationFrame(animate);
    }

    animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}