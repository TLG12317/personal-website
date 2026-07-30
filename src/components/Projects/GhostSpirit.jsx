import { useEffect, useRef } from "react";
import ghost1Src from "../../assets/ghost1.png";
import ghost2Src from "../../assets/ghost2.png";

export default function GhostSpirit() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Preload PNG images
    const ghost1 = new Image();
    ghost1.src = ghost1Src;

    const ghost2 = new Image();
    ghost2.src = ghost2Src;

    let animId;

    const START = { x: 0, y: 0 };
    const END = { x: 0, y: 0 };

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // START is set at Top-Right
      START.x = canvas.width + 150;
      START.y = -150;

      // END is set at Bottom-Left area
      END.x = -150;
      END.y = canvas.height * 0.75;
    }

    resize();
    window.addEventListener("resize", resize);

    // Ghost state tracking
    const ghost = {
      progress: 0,
      direction: 1, // 1: moving left toward END (bottom-left), -1: moving right toward START (top-right)
      x: START.x,
      y: START.y,
    };

    const DURATION = 20; // seconds for full path
    const GHOST_WIDTH = 300;
    const GHOST_HEIGHT = 300;

    let last = performance.now();

    function animate(now) {
      const dt = (now - last) / 1000;
      last = now;

      // Update progress along trajectory
      ghost.progress += (dt / DURATION) * ghost.direction;

      // Reverse direction at endpoints
      if (ghost.progress >= 1) {
        ghost.progress = 1;
        ghost.direction = -1; // Switch to move right (towards top-right)
      }

      if (ghost.progress <= 0) {
        ghost.progress = 0;
        ghost.direction = 1; // Switch to move left (towards bottom-left)
      }

      // Linear interpolation between START (top-right) and END (bottom-left)
      ghost.x = START.x + (END.x - START.x) * ghost.progress;
      ghost.y = START.y + (END.y - START.y) * ghost.progress;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // ghost.direction === -1 -> Moving Right toward Top-Right (ghost1)
      // ghost.direction === 1  -> Moving Left toward Bottom-Left (ghost2)
      const currentImage = ghost.direction === -1 ? ghost1 : ghost2;

      ctx.shadowColor = "#7dffc9";
      ctx.shadowBlur = 15;

      if (currentImage.complete && currentImage.naturalWidth !== 0) {
        ctx.drawImage(
          currentImage,
          ghost.x - GHOST_WIDTH / 2,
          ghost.y - GHOST_HEIGHT / 2,
          GHOST_WIDTH,
          GHOST_HEIGHT
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