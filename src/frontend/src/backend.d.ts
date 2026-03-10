import type { HttpAgent, Identity } from "@icp-sdk/core/agent";

export interface backendInterface {}

export interface CreateActorOptions {
  agentOptions?: { identity?: Identity | Promise<Identity> };
  agent?: HttpAgent;
  processError?: (e: unknown) => never;
}

export class ExternalBlob {
  getBytes(): Promise<Uint8Array>;
  onProgress?: (progress: number) => void;
  static fromURL(url: string): ExternalBlob;
}

export function createActor(
  canisterId: string,
  uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
  downloadFile: (bytes: Uint8Array) => Promise<ExternalBlob>,
  options?: CreateActorOptions,
): Promise<backendInterface>;
