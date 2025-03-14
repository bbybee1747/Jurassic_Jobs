import React, { useEffect, useRef, useState } from "react";

const JeepDinoGame: React.FC = () => {
  console.log("🔄 Component rendered");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(5); // **New: Speed to escape the Dino**
  const scoreRef = useRef(0);

  useEffect(() => {
    console.log("🎮 useEffect triggered");

    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("❌ Canvas not found!");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("❌ Unable to get canvas 2D context");
      return;
    }

    console.log("✅ Canvas found, initializing game...");

    canvas.width = 800;
    canvas.height = 400;

    let jeep = { x: 100, y: 300, width: 80, height: 50, dy: 0, jumping: false };
    let obstacles: { x: number; y: number; width: number; height: number }[] =
      [];
    let dino = { x: -200, y: 290, width: 100, height: 70, speed: 2 }; // **Fixed Dino Y Position**
    let gravity = 0.6;
    let frame = 0;

    const jeepImage = new Image();
    const dinoImage = new Image();
    const obstacleImage = new Image();
    let imagesLoaded = 0;
    const totalImages = 3;

    const checkImagesLoaded = () => {
      imagesLoaded++;
      console.log(`✅ Images Loaded: ${imagesLoaded}/${totalImages}`);
      if (imagesLoaded === totalImages) {
        console.log("✅ All images loaded, starting game...");
        setIsLoaded(true);
        requestAnimationFrame(update);
      }
    };

    jeepImage.onload = checkImagesLoaded;
    dinoImage.onload = checkImagesLoaded;
    obstacleImage.onload = checkImagesLoaded;

    jeepImage.onerror = () => console.error("❌ Failed to load jeep image.");
    dinoImage.onerror = () => console.error("❌ Failed to load dino image.");
    obstacleImage.onerror = () =>
      console.error("❌ Failed to load rock image.");

    jeepImage.src = "/jeep.png";
    dinoImage.src = "/dino.png";
    obstacleImage.src = "/rock.png";

    const jump = (event: KeyboardEvent) => {
      if (event.code === "Space" && !jeep.jumping) {
        console.log("⬆️ Jeep jumping!");
        jeep.dy = -12;
        jeep.jumping = true;
      }
      if (event.code === "ArrowRight") {
        console.log("🏎️ Jeep speeding up!");
        setSpeed(8); // **Speed boost**
      }
    };

    const slowDown = (event: KeyboardEvent) => {
      if (event.code === "ArrowRight") {
        console.log("🐢 Jeep slowing down.");
        setSpeed(5); // **Reset speed after releasing Right Arrow**
      }
    };

    const update = () => {
      if (!isRunning) {
        console.log("⏹️ Game stopped, skipping update.");
        return;
      }
      if (!canvasRef.current) {
        console.log("❌ Canvas disappeared!");
        return;
      }

      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) {
        console.log("❌ Canvas context missing!");
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      scoreRef.current++;
      console.log(`🎯 Frame: ${frame}, Score: ${scoreRef.current}`);

      jeep.y += jeep.dy;
      jeep.dy += gravity;
      if (jeep.y > 300) {
        jeep.y = 300;
        jeep.jumping = false;
      }

      ctx.drawImage(jeepImage, jeep.x, jeep.y, jeep.width, jeep.height);

      if (frame % 100 === 0) {
        obstacles.push({ x: canvas.width, y: 320, width: 40, height: 40 });
        console.log("🚧 New obstacle added");
      }

      obstacles.forEach((obs, index) => {
        obs.x -= speed; // **Now affected by speed**
        if (obs.x + obs.width < 0) {
          obstacles.splice(index, 1);
        }
        ctx.drawImage(obstacleImage, obs.x, obs.y, obs.width, obs.height);

        let jeepBottom = jeep.y + jeep.height;
        let jeepRight = jeep.x + jeep.width;
        let jeepLeft = jeep.x;
        let obsTop = obs.y;
        let obsRight = obs.x + obs.width;
        let obsLeft = obs.x;

        if (
          jeepRight > obsLeft &&
          jeepLeft < obsRight &&
          jeepBottom >= obsTop + 5 &&
          jeep.y + jeep.height - obs.y < 20
        ) {
          console.log(
            `💀 Collision detected! Jeep (y=${jeep.y}, bottom=${jeepBottom}) hit rock (top=${obsTop})`
          );
          setIsRunning(false);
          setIsGameOver(true);
        }
      });

      if (frame > 200) dino.x += dino.speed;
      ctx.drawImage(dinoImage, dino.x, dino.y, dino.width, dino.height);

      if (dino.x + dino.width > jeep.x) {
        console.log("🦖💀 Dino caught Jeep! Game over.");
        setIsRunning(false);
        setIsGameOver(true);
      }

      requestAnimationFrame(update);
    };

    window.addEventListener("keydown", jump);
    window.addEventListener("keyup", slowDown);

    return () => {
      console.log("🚪 Cleaning up event listener...");
      window.removeEventListener("keydown", jump);
      window.removeEventListener("keyup", slowDown);
    };
  }, [isRunning, speed]);

  const restartGame = () => {
    console.log("🔄 Restarting game...");
    window.location.reload();
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Jeep vs Dino: Score {scoreRef.current}</h2>
      <canvas
        ref={canvasRef}
        style={{ border: "2px solid black", display: "block", margin: "auto" }}
      />

      {!isLoaded && <p>⏳ Loading game...</p>}

      {isGameOver && (
        <div>
          <h2>Game Over! You got eaten!</h2>
          <button
            onClick={restartGame}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default JeepDinoGame;
