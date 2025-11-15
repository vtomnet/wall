// src/worker.ts

export interface Env {
  AUTH_TOKEN: string; // set this in your Cloudflare env / wrangler.toml
}

// You will implement this
// It should return the raw bytes of an image (e.g. PNG/JPEG/WebP/etc.)
async function getImage(): Promise<Uint8Array | ArrayBuffer> {
  // TODO: implement
  throw new Error("getImage() not implemented");
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Only support GET /generate
    if (request.method !== "GET" || url.pathname !== "/generate") {
      return new Response("Not found", { status: 404 });
    }

    // Require auth header (change header name if you prefer)
    const token = request.headers.get("x-auth-token");
    if (!token || token !== env.AUTH_TOKEN) {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      const imageData = await getImage();

      // Normalize to ArrayBuffer for Response
      const body =
        imageData instanceof ArrayBuffer
          ? imageData
          : imageData.buffer.slice(
              imageData.byteOffset,
              imageData.byteOffset + imageData.byteLength
            );

      // Set the appropriate Content-Type for your image format
      // e.g. "image/png", "image/jpeg", etc.
      return new Response(body, {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "no-store",
        },
      });
    } catch (err) {
      // Optionally log error with console.error(err);
      return new Response("Failed to generate image", { status: 500 });
    }
  },
};
