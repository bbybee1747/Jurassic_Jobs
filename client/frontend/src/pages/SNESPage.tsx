import React, { useEffect, useRef, useState } from "react";

const JeepDinoGame: React.FC = () => {
  console.log("🔄 Component rendered");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(5);
  const [score, setScore] = useState(0);
  const [jumpCount, setJumpCount] = useState(0); // Track the number of jumps
  const animationFrameRef = useRef<number | null>(null);

  // Track Jeep's horizontal movement state
  const moveLeft = useRef(false);
  const moveRight = useRef(false);

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
    let obstacles: { x: number; y: number; width: number; height: number; cleared: boolean; isGoldenEgg: boolean }[] = [];
    let pterodactyl = { x: -100, y: 50, width: 80, height: 60, speed: 3, active: false };
    let charles = { x: -100, y: 50, width: 80, height: 60, speed: 3, active: false }; // Charles object
    let gravity = 0.6;
    let frame = 0;

    const jeepImage = new Image();
    const goldeneggImage = new Image();
    const pterodactylImage = new Image();
    const rockImage = new Image();
    const charlesImage = new Image();
    let imagesLoaded = 0;
    const totalImages = 5; // Updated: Added Charles image

    const checkImagesLoaded = () => {
      imagesLoaded++;
      console.log(`✅ Images Loaded: ${imagesLoaded}/${totalImages}`);
      if (imagesLoaded === totalImages) {
        console.log("✅ All images loaded, starting game...");
        setIsLoaded(true);
        animationFrameRef.current = requestAnimationFrame(update);
      }
    };

    jeepImage.onload = checkImagesLoaded;
    goldeneggImage.onload = checkImagesLoaded;
    pterodactylImage.onload = checkImagesLoaded;
    rockImage.onload = checkImagesLoaded;
    charlesImage.onload = checkImagesLoaded;

    jeepImage.onerror = () => console.error("❌ Failed to load jeep image.");
    goldeneggImage.onerror = () => console.error("❌ Failed to load golden egg image.");
    pterodactylImage.onerror = () => console.error("❌ Failed to load pterodactyl image.");
    rockImage.onerror = () => console.error("❌ Failed to load rock image.");
    charlesImage.onerror = () => console.error("❌ Failed to load Charles image.");

    jeepImage.src = "/jeep.png";
    goldeneggImage.src = "/goldenegg.png";
    pterodactylImage.src = "/pterodactyl.png";
    rockImage.src = "/rock.png";
    charlesImage.src = "/charles.png";

    const jump = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault(); // Always prevent default Spacebar behavior (scrolling)

        if (isRunning) {
          if (!jeep.jumping || jumpCount < 1) { // Allow double jump (only once)
            console.log("⬆️ Jeep jumping!");
            jeep.dy = -13; // Increase vertical velocity for a higher jump
            jeep.jumping = true;
            setJumpCount((prev) => prev + 1); // Increment jump count
          }
        }
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "ArrowLeft") {
        moveLeft.current = true; // Start moving left
      } else if (event.code === "ArrowRight") {
        moveRight.current = true; // Start moving right
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === "ArrowLeft") {
        moveLeft.current = false; // Stop moving left
      } else if (event.code === "ArrowRight") {
        moveRight.current = false; // Stop moving right
      }
    };

    const slowDown = (event: KeyboardEvent) => {
      if (event.code === "ArrowRight" && isRunning) {
        console.log("🐢 Jeep slowing down.");
        setSpeed(5);
      }
    };

    const spawnPterodactyl = () => {
      if (!pterodactyl.active) {
        pterodactyl.x = canvas.width; // Start from the right side
        pterodactyl.active = true;
        console.log("🦖 Pterodactyl spawned!");
      }
    };

    const spawnCharles = () => {
      if (!charles.active) {
        charles.x = canvas.width; // Start from the right side
        charles.active = true;
        pterodactyl.active = false; // Ensure pterodactyl disappears when Charles appears
        console.log("👨‍💻 Charles spawned!");
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
    
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    
      // Draw the sky (blue and yellow gradient)
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height / 2);
      skyGradient.addColorStop(0, "#87CEEB"); // Light blue
      skyGradient.addColorStop(1, "#FFD700"); // Yellow
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height / 2);
    
      // Draw the grass (green)
      ctx.fillStyle = "#4CAF50"; // Green
      ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2); // Fixed grass height
    
      frame++;
    
      // Update Jeep position
      jeep.y += jeep.dy;
      jeep.dy += gravity;
    
      // Update Jeep's horizontal position based on movement state
      if (moveLeft.current) {
        jeep.x -= 5; // Move left
      }
      if (moveRight.current) {
        jeep.x += 5; // Move right
      }
    
      // Ensure the Jeep stays within the canvas bounds
      if (jeep.x < 0) {
        jeep.x = 0; // Prevent Jeep from moving off the left side
      } else if (jeep.x + jeep.width > canvas.width) {
        jeep.x = canvas.width - jeep.width; // Prevent Jeep from moving off the right side
      }
    
      if (jeep.y > 300) {
        jeep.y = 300;
        jeep.jumping = false; // Reset jumping state when landing
        setJumpCount(0); // Reset jump count when landing
        console.log("🛬 Jeep landed!");
      }
    
      // Calculate shadow opacity based on Jeep's height
      const groundLevel = 300; // Y position of the ground
      const maxJumpHeight = 150; // Maximum height the Jeep can jump
      const distanceFromGround = Math.max(0, groundLevel - jeep.y); // Distance from the ground
      const shadowOpacity = Math.max(0, 0.3 * (1 - distanceFromGround / maxJumpHeight)); // Fade shadow as Jeep jumps higher
    
      // Draw Jeep shadow (fixed to the ground)
      const shadowY = groundLevel + jeep.height; // Ground level (Y position of the shadow)
      ctx.beginPath();
      ctx.ellipse(
        jeep.x + jeep.width / 2, // X position of the shadow (center of the Jeep)
        shadowY, // Fixed Y position (ground level)
        jeep.width / 2, // Width of the shadow (same as Jeep width)
        10, // Height of the shadow (flattened ellipse)
        0, // Rotation
        0, // Start angle
        2 * Math.PI // End angle
      );
      ctx.fillStyle = `rgba(0, 0, 0, ${shadowOpacity})`; // Dynamic opacity based on Jeep's height
      ctx.fill();
    
      // Draw Jeep
      ctx.drawImage(jeepImage, jeep.x, jeep.y, jeep.width, jeep.height);
    
      // Add new obstacles (golden eggs or rocks)
      if (frame % 100 === 0) {
        const isGoldenEgg = Math.random() < 0.5; // 50% chance of spawning a golden egg
        obstacles.push({
          x: canvas.width,
          y: 320,
          width: 40,
          height: 40,
          cleared: false,
          isGoldenEgg,
        });
        console.log(`🚧 New ${isGoldenEgg ? "golden egg" : "rock"} added`);
      }
    
      // Update and draw obstacles
      obstacles.forEach((obs, index) => {
        obs.x -= speed;
        if (obs.x + obs.width < 0) {
          obstacles.splice(index, 1);
        }
    
        // Draw obstacle (golden egg or rock)
        if (obs.isGoldenEgg) {
          ctx.drawImage(goldeneggImage, obs.x, obs.y, obs.width, obs.height);
        } else {
          ctx.drawImage(rockImage, obs.x, obs.y, obs.width, obs.height);
        }
    
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
          console.log(`💀 Collision detected! Jeep hit ${obs.isGoldenEgg ? "golden egg" : "rock"}`);
          setIsRunning(false);
          setIsGameOver(true);
    
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          return;
        }
    
        // Check if Jeep successfully jumps over the obstacle
        if (!obs.cleared && obsRight < jeepLeft) {
          console.log(`🎉 Jeep cleared a ${obs.isGoldenEgg ? "golden egg" : "rock"}!`);
          setScore((prevScore) => prevScore + (obs.isGoldenEgg ? 5 : 1)); // Reward 5 points for golden egg, 1 point for rock
          obs.cleared = true; // Mark the obstacle as cleared
        }
      });
    
      // Update and draw pterodactyl
      if (pterodactyl.active) {
        pterodactyl.x -= pterodactyl.speed; // Move pterodactyl to the left
        ctx.drawImage(pterodactylImage, pterodactyl.x, pterodactyl.y, pterodactyl.width, pterodactyl.height);
    
        // Collision detection between Jeep and pterodactyl
        let jeepBottom = jeep.y + jeep.height;
        let jeepRight = jeep.x + jeep.width;
        let jeepLeft = jeep.x;
        let pteroBottom = pterodactyl.y + pterodactyl.height;
        let pteroRight = pterodactyl.x + pterodactyl.width;
        let pteroLeft = pterodactyl.x;
    
        if (
          jeepRight > pteroLeft &&
          jeepLeft < pteroRight &&
          jeepBottom > pterodactyl.y &&
          jeep.y < pteroBottom
        ) {
          console.log("💀 Collision detected! Jeep hit the pterodactyl!");
          setIsRunning(false);
          setIsGameOver(true);
    
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          return;
        }
    
        // Reset pterodactyl when it goes off-screen
        if (pterodactyl.x + pterodactyl.width < 0) {
          pterodactyl.active = false;
        }
      }
    
      // Update and draw Charles (no collision detection)
      if (charles.active) {
        charles.x -= charles.speed; // Move Charles to the left
        ctx.drawImage(charlesImage, charles.x, charles.y, charles.width, charles.height);
    
        // Draw "Happy Coding" text below Charles
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.fillText("Happy Coding", charles.x, charles.y + charles.height + 20);
    
        // Reset Charles when it goes off-screen
        if (charles.x + charles.width < 0) {
          charles.active = false;
        }
      }
    
      // Spawn pterodactyl every 5 seconds (300 frames at 60 FPS)
      if (frame % 300 === 0 && !charles.active) {
        spawnPterodactyl();
      }
    
      // Spawn Charles every 10 seconds (600 frames at 60 FPS)
      if (frame % 600 === 0) {
        spawnCharles();
      }
    
      // Continue the game loop
      animationFrameRef.current = requestAnimationFrame(update);
    };

    // Add event listeners for jumping, movement, and slowing down
    window.addEventListener("keydown", jump);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("keyup", slowDown);

    return () => {
      console.log("🚪 Cleaning up event listener...");
      window.removeEventListener("keydown", jump);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("keyup", slowDown);

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
      <h2 style={{ margin: "10px", fontSize: "24px", color: "white" }}>Extinction Drift</h2>
      <h2 style={{ margin: "10px", fontSize: "20px", color: "white" }}>Score: {score}</h2>
      <canvas
        ref={canvasRef}
        style={{ border: "2px groove white", display: "block", margin: "auto" }}
      />
      {!isLoaded && <p>⏳ Loading game...</p>}
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
          <h2 style={{ margin: "10px", fontSize: "24px", color: "white" }}>Game Over! You hit an obstacle!</h2>
          <button
            onClick={restartGame}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              backgroundColor: "#4CAF50",
              color: "black",
              border: "none",
              borderRadius: "5px",
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