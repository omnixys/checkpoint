/** A generation token makes close/source changes safe even while permission is pending. */
export class CameraSession {
  private generation = 0;
  private stream: MediaStream | undefined;

  async start(getUserMedia: MediaDevices["getUserMedia"]): Promise<MediaStream | null> {
    this.stop();
    const generation = this.generation;
    const stream = await getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false,
    });
    if (generation !== this.generation) {
      for (const track of stream.getTracks()) track.stop();
      return null;
    }
    this.stream = stream;
    return stream;
  }

  stop() {
    this.generation++;
    for (const track of this.stream?.getTracks() ?? []) track.stop();
    this.stream = undefined;
  }
}

export class ObjectUrls {
  private urls = new Set<string>();

  create(blob: Blob): string {
    const url = URL.createObjectURL(blob);
    this.urls.add(url);
    return url;
  }

  revoke(url: string) {
    if (this.urls.delete(url)) URL.revokeObjectURL(url);
  }

  dispose() {
    for (const url of this.urls) URL.revokeObjectURL(url);
    this.urls.clear();
  }
}
