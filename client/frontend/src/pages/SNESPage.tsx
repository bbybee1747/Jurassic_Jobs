import { useEffect, useRef } from "react";
import { NES } from "jsnes";

function SNESPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  let nes = useRef<NES | null>(null);

  useEffect(() => {
    nes.current = new NES({
      onFrame: (frameBuffer: Uint8Array) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const imageData = ctx.createImageData(256, 240);
        imageData.data.set(frameBuffer);
        ctx.putImageData(imageData, 0, 0);
      },
      onAudioSample: (_: any) => {},
    });
  }, []);

  const loadROM = async () => {
    const response = await fetch("/roms/JurassicPark.sfc");
    const arrayBuffer = await response.arrayBuffer();
    if (nes.current) {
      nes.current.loadROM(new Uint8Array(arrayBuffer));
      nes.current.start();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 p-10">
      <h1 className="text-3xl font-bold mb-6">🎮 Play Jurassic Park SNES</h1>
      <canvas
        ref={canvasRef}
        width="256"
        height="240"
        className="border border-gray-400 shadow-lg"
      />
      <button
        onClick={loadROM}
        className="mt-4 bg-blue-600 text-white px-6 py-3 font-semibold border border-blue-700 rounded-lg hover:bg-blue-700 transition-all shadow-md"
      >
        Load Game
      </button>
    </div>
  );
}

export default SNESPage;
