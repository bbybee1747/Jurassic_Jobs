import React, { useEffect, useRef, useState } from "react";

const JeepDinoGame: React.FC = () => {
  console.log("🔄 Component rendered");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(5); // **Speed to escape obstacles**
  const [score, setScore] = useState(0); // **Score state**
  const animationFrameRef = useRef<number | null>(null); // **Ref to store animation frame ID**

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

    let jeep = { x: 100, y: 300, width: 100, height: 60, dy: 0, jumping: false };
    let obstacles: { x: number; y: number; width: number; height: number; cleared: boolean }[] =
      []; // **Added `cleared` flag**
    let gravity = 0.6;
    let frame = 0;

    const jeepImage = new Image();
    const obstacleImage = new Image();
    let imagesLoaded = 0;
    const totalImages = 2;

    const checkImagesLoaded = () => {
      imagesLoaded++;
      console.log(`✅ Images Loaded: ${imagesLoaded}/${totalImages}`);
      if (imagesLoaded === totalImages) {
        console.log("✅ All images loaded, starting game...");
        setIsLoaded(true);
        animationFrameRef.current = requestAnimationFrame(update); // **Start game loop**
      }
    };

    jeepImage.onload = checkImagesLoaded;
    obstacleImage.onload = checkImagesLoaded;

    jeepImage.onerror = () => console.error("❌ Failed to load jeep image.");
    obstacleImage.onerror = () =>
      console.error("❌ Failed to load rock image.");

    jeepImage.src = "/jeep.png";
    obstacleImage.src = "/rock.png";

    const jump = (event: KeyboardEvent) => {
      if (event.code === "Space" && !jeep.jumping && isRunning) {
        event.preventDefault(); // **Prevent default Spacebar behavior**
        console.log("⬆️ Jeep jumping!");
        jeep.dy = -12;
        jeep.jumping = true;
      }
      if (event.code === "ArrowRight" && isRunning) {
        console.log("🏎️ Jeep speeding up!");
        setSpeed(8); // **Speed boost**
      }
    };

    const slowDown = (event: KeyboardEvent) => {
      if (event.code === "ArrowRight" && isRunning) {
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

      // **Draw grass background**
      ctx.fillStyle = "#4CAF50"; // **Green color for grass**
      ctx.fillRect(0, 300, canvas.width, 100); // **Grass covers the bottom of the canvas**

      frame++;

      // Update Jeep position
      jeep.y += jeep.dy;
      jeep.dy += gravity;
      if (jeep.y > 300) {
        jeep.y = 300;
        jeep.jumping = false;
      }

      // Draw Jeep
      ctx.drawImage(jeepImage, jeep.x, jeep.y, jeep.width, jeep.height);

      // Add new obstacles
      if (frame % 100 === 0) {
        obstacles.push({ x: canvas.width, y: 320, width: 40, height: 40, cleared: false }); // **Added `cleared` flag**
        console.log("🚧 New obstacle added");
      }

      // Update and draw obstacles
      obstacles.forEach((obs, index) => {
        obs.x -= speed; // **Now affected by speed**
        if (obs.x + obs.width < 0) {
          obstacles.splice(index, 1);
        }
        ctx.drawImage(obstacleImage, obs.x, obs.y, obs.width, obs.height);

        // Collision detection between Jeep and obstacles
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

          // Stop the game loop
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          return; // **Stop further execution**
        }

        // **Check if Jeep successfully jumps over the obstacle**
        if (!obs.cleared && obsRight < jeepLeft) {
          console.log("🎉 Jeep cleared an obstacle!");
          setScore((prevScore) => prevScore + 1); // Increment score
          obs.cleared = true; // Mark the obstacle as cleared
        }
      });

      // Continue the game loop
      animationFrameRef.current = requestAnimationFrame(update);
    };

    // Add event listeners for jumping and slowing down
    window.addEventListener("keydown", jump);
    window.addEventListener("keyup", slowDown);

    return () => {
      console.log("🚪 Cleaning up event listener...");
      window.removeEventListener("keydown", jump);
      window.removeEventListener("keyup", slowDown);

      // Cancel the animation frame when the component unmounts
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, speed]);

  const restartGame = () => {
    console.log("🔄 Restarting game...");
    window.location.reload();
  };

  return (
    <div style={{ textAlign: "center", position: "relative", height: "100vh" }}>
      {/* Game Title */}
      <h2 style={{ margin: "10px", fontSize: "24px", color: "black" }}>
        RockRunner
      </h2>
  
      {/* Score */}
      <h2 style={{ margin: "10px", fontSize: "20px", color: "black" }}>
        Score: {score}
      </h2>
  
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        style={{ border: "2px solid black", display: "block", margin: "auto" }}
      />
  
      {/* Loading Message */}
      {!isLoaded && <p>⏳ Loading game...</p>}
  
      {/* Game Over Message */}
      {isGameOver && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <h2 style={{ margin: "10px", fontSize: "24px", color: "black" }}>
            Game Over! You hit an obstacle!
          </h2>
          <button
            onClick={restartGame}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: "#4CAF50", // **Bright green background**
              color: "white", // **White text**
              border: "none", // **Remove default border**
              borderRadius: "5px", // **Rounded corners**
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