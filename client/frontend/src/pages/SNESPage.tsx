import React, { useEffect, useRef, useState } from "react";

const JeepDinoGame: React.FC = () => {
  const [gameKey] = useState(0);
  return (
    <div
      key={gameKey}
      style={{ textAlign: "center", position: "relative", height: "100vh" }}
    >
      <Game />
    </div>
  );
};

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(5);
  const [score, setScore] = useState(0);
  const [jumpCount, setJumpCount] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const moveLeft = useRef(false);
  const moveRight = useRef(false);

  // Standard AABB collision detection.
  const rectsCollide = (
    r1: { x: number; y: number; width: number; height: number },
    r2: { x: number; y: number; width: number; height: number }
  ) =>
    r1.x < r2.x + r2.width &&
    r1.x + r1.width > r2.x &&
    r1.y < r2.y + r2.height &&
    r1.y + r1.height > r2.y;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 800;
    canvas.height = 400;

    let jeep = {
      x: 100,
      y: 300,
      width: 100,
      height: 60,
      dy: 0,
      jumping: false,
    };
    let obstacles: {
      x: number;
      y: number;
      width: number;
      height: number;
      cleared: boolean;
      isGoldenEgg: boolean;
    }[] = [];
    let pterodactyl = {
      x: -100,
      y: 50,
      width: 80,
      height: 60,
      speed: 3,
      active: false,
    };
    let charles = {
      x: -100,
      y: 50,
      width: 80,
      height: 60,
      speed: 3,
      active: false,
    };
    const groundLevel = 300;
    const gravity = 0.6;
    let frame = 0;

    const jeepImage = new Image();
    const goldeneggImage = new Image();
    const pterodactylImage = new Image();
    const rockImage = new Image();
    const charlesImage = new Image();
    let imagesLoaded = 0;
    const totalImages = 5;
    const checkImagesLoaded = () => {
      imagesLoaded++;
      if (imagesLoaded === totalImages) {
        setIsLoaded(true);
        animationFrameRef.current = requestAnimationFrame(update);
      }
    };
    jeepImage.onload = checkImagesLoaded;
    goldeneggImage.onload = checkImagesLoaded;
    pterodactylImage.onload = checkImagesLoaded;
    rockImage.onload = checkImagesLoaded;
    charlesImage.onload = checkImagesLoaded;
    jeepImage.src = "/jeep.png";
    goldeneggImage.src = "/goldenegg.png";
    pterodactylImage.src = "/pterodactyl.png";
    rockImage.src = "/rock.png";
    charlesImage.src = "/charles.png";

    const jump = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        if (isRunning && (!jeep.jumping || jumpCount < 1)) {
          jeep.dy = -13;
          jeep.jumping = true;
          setJumpCount((prev) => prev + 1);
        }
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "ArrowLeft") moveLeft.current = true;
      else if (event.code === "ArrowRight") moveRight.current = true;
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === "ArrowLeft") moveLeft.current = false;
      else if (event.code === "ArrowRight") moveRight.current = false;
    };

    const slowDown = (event: KeyboardEvent) => {
      if (event.code === "ArrowRight" && isRunning) setSpeed(5);
    };

    const spawnPterodactyl = () => {
      if (!pterodactyl.active) {
        pterodactyl.x = canvas.width;
        pterodactyl.active = true;
      }
    };

    const spawnCharles = () => {
      if (!charles.active) {
        charles.x = canvas.width;
        charles.active = true;
        pterodactyl.active = false;
      }
    };

    const update = () => {
      if (!isRunning) return;
      if (!canvasRef.current) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height / 2);
      skyGradient.addColorStop(0, "#87CEEB");
      skyGradient.addColorStop(1, "#FFD700");
      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height / 2);
      ctx.fillStyle = "#4CAF50";
      ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

      frame++;
      jeep.y += jeep.dy;
      jeep.dy += gravity;
      if (moveLeft.current) jeep.x -= 5;
      if (moveRight.current) jeep.x += 5;
      if (jeep.x < 0) jeep.x = 0;
      if (jeep.x + jeep.width > canvas.width)
        jeep.x = canvas.width - jeep.width;
      if (jeep.y > groundLevel) {
        jeep.y = groundLevel;
        jeep.jumping = false;
        setJumpCount(0);
      }

      const distanceFromGround = Math.max(0, groundLevel - jeep.y);
      const shadowOpacity = Math.max(0, 0.3 * (1 - distanceFromGround / 150));
      const shadowY = groundLevel + jeep.height;
      ctx.beginPath();
      ctx.ellipse(
        jeep.x + jeep.width / 2,
        shadowY,
        jeep.width / 2,
        10,
        0,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = `rgba(0,0,0,${shadowOpacity})`;
      ctx.fill();

      ctx.drawImage(jeepImage, jeep.x, jeep.y, jeep.width, jeep.height);

      if (frame % 100 === 0) {
        const isGoldenEgg = Math.random() < 0.5;
        obstacles.push({
          x: canvas.width,
          y: 320,
          width: 40,
          height: 40,
          cleared: false,
          isGoldenEgg,
        });
      }

      for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        obs.x -= speed;
        if (obs.x + obs.width < 0) {
          obstacles.splice(i, 1);
          i--;
          continue;
        }
        if (obs.isGoldenEgg) {
          ctx.drawImage(goldeneggImage, obs.x, obs.y, obs.width, obs.height);
          if (rectsCollide(jeep, obs)) {
            if (!obs.cleared) {
              setScore((prev) => prev + 5);
              obs.cleared = true;
            }
          }
        } else {
          ctx.drawImage(rockImage, obs.x, obs.y, obs.width, obs.height);
          if (jeep.y >= groundLevel - 5) {
            // On ground: full collision.
            if (rectsCollide(jeep, obs)) {
              setIsRunning(false);
              setIsGameOver(true);
              if (animationFrameRef.current)
                cancelAnimationFrame(animationFrameRef.current);
              return;
            }
          } else {
            // Airborne: use a reduced collision box for the rock.
            const padding = 10;
            const reducedRock = {
              x: obs.x + padding,
              y: obs.y + padding,
              width: obs.width - 2 * padding,
              height: obs.height - 2 * padding,
            };
            if (rectsCollide(jeep, reducedRock)) {
              setIsRunning(false);
              setIsGameOver(true);
              if (animationFrameRef.current)
                cancelAnimationFrame(animationFrameRef.current);
              return;
            }
          }
        }
        if (!obs.cleared && obs.x + obs.width < jeep.x) {
          if (!obs.isGoldenEgg) setScore((prev) => prev + 1);
          obs.cleared = true;
        }
      }

      if (pterodactyl.active) {
        pterodactyl.x -= pterodactyl.speed;
        ctx.drawImage(
          pterodactylImage,
          pterodactyl.x,
          pterodactyl.y,
          pterodactyl.width,
          pterodactyl.height
        );
        if (rectsCollide(jeep, pterodactyl)) {
          setIsRunning(false);
          setIsGameOver(true);
          if (animationFrameRef.current)
            cancelAnimationFrame(animationFrameRef.current);
          return;
        }
        if (pterodactyl.x + pterodactyl.width < 0) pterodactyl.active = false;
      }
      if (charles.active) {
        charles.x -= charles.speed;
        ctx.drawImage(
          charlesImage,
          charles.x,
          charles.y,
          charles.width,
          charles.height
        );
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.fillText(
          "Happy Coding",
          charles.x,
          charles.y + charles.height + 20
        );
        if (charles.x + charles.width < 0) charles.active = false;
      }
      if (frame % 300 === 0 && !charles.active) spawnPterodactyl();
      if (frame % 600 === 0) spawnCharles();
      animationFrameRef.current = requestAnimationFrame(update);
    };

    window.addEventListener("keydown", jump);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("keyup", slowDown);
    return () => {
      window.removeEventListener("keydown", jump);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("keyup", slowDown);
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRunning, speed]);

  return (
    <>
      <h2 style={{ margin: "10px", fontSize: "24px", color: "white" }}>
        Extinction Drift
      </h2>
      <h2 style={{ margin: "10px", fontSize: "20px", color: "white" }}>
        Score: {score}
      </h2>
      <canvas
        ref={canvasRef}
        style={{ border: "2px groove white", display: "block", margin: "auto" }}
      />
      <p style={{ color: "white" }}>{!isLoaded && "⏳ Loading game..."}</p>
      {isGameOver && (
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <h2 style={{ margin: "10px", fontSize: "24px", color: "white" }}>
            Game Over! You hit an obstacle!
          </h2>
          <button
            onClick={() => window.location.reload()}
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
    </>
  );
};

export default JeepDinoGame;
