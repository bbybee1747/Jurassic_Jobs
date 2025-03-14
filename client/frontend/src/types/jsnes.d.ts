declare module "jsnes" {
    export class NES {
      constructor(options: any);
      loadROM(data: Uint8Array): void;
      start(): void;
      onFrame: (frameBuffer: Uint8Array) => void;
      onAudioSample: (left: number, right: number) => void;
    }
  }
  