import type { Identity } from "@icp-sdk/core/agent";

export type { backendInterface, CreateActorOptions } from "./backend.d";

export class ExternalBlob {
  private _url?: string;
  private _bytes?: Uint8Array;
  onProgress?: (progress: number) => void;

  async getBytes(): Promise<Uint8Array> {
    if (this._bytes) return this._bytes;
    if (this._url) {
      const res = await fetch(this._url);
      return new Uint8Array(await res.arrayBuffer());
    }
    return new Uint8Array();
  }

  static fromURL(url: string): ExternalBlob {
    const b = new ExternalBlob();
    b._url = url;
    return b;
  }
}

export async function createActor(
  _canisterId: string,
  _uploadFile: (file: ExternalBlob) => Promise<Uint8Array>,
  _downloadFile: (bytes: Uint8Array) => Promise<ExternalBlob>,
  _options?: { agentOptions?: { identity?: Identity | Promise<Identity> } },
): Promise<object> {
  return {};
}
