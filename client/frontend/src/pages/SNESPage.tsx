import React, { useEffect, useRef, useState } from "react";

const JeepDinoGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const [speed, setSpeed] = useState(5);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [topScores, setTopScores] = useState<number[]>([]); // State for top 10 high scores
  const animationFrameRef = useRef<number | null>(null);

  const moveLeft = useRef(false);
  const moveRight = useRef(false);

  // 🛠️ UseRef versions of jeep and jumpCount
  const jeepRef = useRef({
    x: 100,
    y: 300,
    width: 100,
    height: 60,
    dy: 0,
    jumping: false,
  });
  const jumpCountRef = useRef(0);

  // 🏆 Function to update and retrieve top 10 high scores
  const updateTopScores = (newScore: number) => {
    const savedScores = JSON.parse(localStorage.getItem("jeepTopScores") || "[]") as number[];
    const updatedScores = [...savedScores, newScore]
      .sort((a, b) => b - a) // Sort in descending order
      .slice(0, 10); // Keep only top 10
    localStorage.setItem("jeepTopScores", JSON.stringify(updatedScores));
    setTopScores(updatedScores);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 400;

    let obstacles: { x: number; y: number; width: number; height: number; cleared: boolean; isGoldenEgg: boolean }[] =
      [];
    let pterodactyl = { x: -100, y: 50, width: 80, height: 60, speed: 3, active: false };
    let charles = { x: -100, y: 50, width: 80, height: 60, speed: 3, active: false };
    let gravity = 0.2;
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

    // 🏆 Load high score and top scores from localStorage
    const savedHighScore = parseInt(localStorage.getItem("jeepHighScore") || "0", 10);
    setHighScore(savedHighScore);

    const savedTopScores = JSON.parse(localStorage.getItem("jeepTopScores") || "[]");
    setTopScores(savedTopScores);

    const jump = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        const jeep = jeepRef.current;

        if (!isRunning) return;

        if (!jeep.jumping || jumpCountRef.current < 2) {
          jeep.dy = -8;
          jeep.jumping = true;
          jumpCountRef.current++;
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
      if (!isRunning || !canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      const jeep = jeepRef.current;

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
      if (jeep.x + jeep.width > canvas.width) jeep.x = canvas.width - jeep.width;

      if (jeep.y > 300) {
        jeep.y = 300;
        jeep.dy = 0;
        jeep.jumping = false;
        jumpCountRef.current = 0;
      }

      const groundLevel = 300;
      const maxJumpHeight = 150;
      const distanceFromGround = Math.max(0, groundLevel - jeep.y);
      const shadowOpacity = Math.max(0, 0.3 * (1 - distanceFromGround / maxJumpHeight));
      const shadowY = groundLevel + jeep.height;

      ctx.beginPath();
      ctx.ellipse(jeep.x + jeep.width / 2, shadowY, jeep.width / 2, 10, 0, 0, 2 * Math.PI);
      ctx.fillStyle = rgba(0, 0, 0, shadowOpacity);
      ctx.fill();

      ctx.drawImage(jeepImage, jeep.x, jeep.y, jeep.width, jeep.height);

      if (frame % 100 === 0) {
        const isGoldenEgg = Math.random() < 0.5;
        obstacles.push({ x: canvas.width, y: 320, width: 40, height: 40, cleared: false, isGoldenEgg });
      }

      obstacles.forEach((obs, index) => {
        obs.x -= speed;
        if (obs.x + obs.width < 0) obstacles.splice(index, 1);

        if (obs.isGoldenEgg) {
          ctx.drawImage(goldeneggImage, obs.x, obs.y, obs.width, obs.height);
        } else {
          ctx.drawImage(rockImage, obs.x, obs.y, obs.width, obs.height);
        }

        const jeepBottom = jeep.y + jeep.height;
        const jeepRight = jeep.x + jeep.width;
        const jeepLeft = jeep.x;
        const obsTop = obs.y;
        const obsRight = obs.x + obs.width;
        const obsLeft = obs.x;

        if (
          jeepRight > obsLeft &&
          jeepLeft < obsRight &&
          jeepBottom >= obsTop + 5 &&
          jeep.y + jeep.height - obs.y < 20
        ) {
          const prevHigh = parseInt(localStorage.getItem("jeepHighScore") || "0", 10);
          if (score > prevHigh) {
            localStorage.setItem("jeepHighScore", score.toString());
            setHighScore(score);
          }

          // 🏆 Update top scores
          updateTopScores(score);

          setIsRunning(false);
          setIsGameOver(true);
          if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
          return;
        }

        if (!obs.cleared && obsRight < jeepLeft) {
          setScore((prev) => {
            const newScore = prev + (obs.isGoldenEgg ? 5 : 1);

            const prevHigh = parseInt(localStorage.getItem("jeepHighScore") || "0", 10);
            if (newScore > prevHigh) {
              localStorage.setItem("jeepHighScore", newScore.toString());
              setHighScore(newScore);
            }

            return newScore;
          });
          obs.cleared = true;
        }
      });

      if (pterodactyl.active) {
        pterodactyl.x -= pterodactyl.speed;
        ctx.drawImage(pterodactylImage, pterodactyl.x, pterodactyl.y, pterodactyl.width, pterodactyl.height);

        const jeepBottom = jeep.y + jeep.height;
        const jeepRight = jeep.x + jeep.width;
        const jeepLeft = jeep.x;
        const pteroBottom = pterodactyl.y + pterodactyl.height;
        const pteroRight = pterodactyl.x + pterodactyl.width;
        const pteroLeft = pterodactyl.x;

        if (
          jeepRight > pteroLeft &&
          jeepLeft < pteroRight &&
          jeepBottom > pterodactyl.y &&
          jeep.y < pteroBottom
        ) {
          const prevHigh = parseInt(localStorage.getItem("jeepHighScore") || "0", 10);
          if (score > prevHigh) {
            localStorage.setItem("jeepHighScore", score.toString());
            setHighScore(score);
          }

          // 🏆 Update top scores
          updateTopScores(score);

          setIsRunning(false);
          setIsGameOver(true);
          if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
          return;
        }

        if (pterodactyl.x + pterodactyl.width < 0) pterodactyl.active = false;
      }

      if (charles.active) {
        charles.x -= charles.speed;
        ctx.drawImage(charlesImage, charles.x, charles.y, charles.width, charles.height);
        ctx.fillStyle = "black";
        ctx.font = "16px Arial";
        ctx.fillText("Happy Coding", charles.x, charles.y + charles.height + 20);

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
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRunning, speed]);

  const restartGame = () => {
    window.location.reload();
  };

  return (
    <div style={{ textAlign: "center", position: "relative", height: "100vh" }}>
      <h2 style={{ margin: "10px", fontSize: "24px", color: "white" }}>Extinction Drift</h2>
      <h2 style={{ margin: "10px", fontSize: "20px", color: "white" }}>Score: {score}</h2>
      <canvas ref={canvasRef} style={{ border: "2px groove white", display: "block", margin: "auto" }} />
      {!isLoaded && <p>⏳ Loading game...</p>}
      <div style={{ position: "absolute", bottom: "200px", width: "100%" }}>
        <h2 style={{ fontSize: "20px", color: "#FFD700" }}>🏆 High Score: {highScore}</h2>
      </div>
      {isGameOver && (
        <div
          style={{
            position: "absolute",
            top: "38%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
          }}
        >
          <h2 style={{ margin: "10px", fontSize: "24px", color: "white" }}>
            Game Over! You hit an obstacle!
          </h2>
          <h3 style={{ margin: "10px", fontSize: "20px", color: "#FFD700" }}>
            🏆 High Score: {highScore}
          </h3>
          <div style={{ margin: "10px", fontSize: "18px", color: "white" }}>
            <h4>Top 10 High Scores:</h4>
            <ol>
              {topScores.map((score, index) => (
                <li key={index}>{score}</li>
              ))}
            </ol>
          </div>
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
const rgba = (r: number, g: number, b: number, a: number): string => {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};
