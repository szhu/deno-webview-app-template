import { serve } from "https://deno.land/std@0.76.0/http/server.ts";

export async function getHtml() {
  return await Deno.readTextFile("src/ui.html");
}

export async function runServer(port: number) {
  const server = serve({ port });
  console.log(`Started server on http://localhost:${port}/`);

  for await (const req of server) {
    if (req.method === "GET") {
      req.respond({
        headers: new Headers([
          ["Content-Type", "text/html"],
        ]),
        body: await getHtml(),
      });
    } else if (req.method === "POST") {
      req.respond({
        headers: new Headers([
          ["Content-Type", "application/json"],
        ]),
        body: JSON.stringify(
          {
            hello: "world!",
            "info": "This is a response from serverWorker.ts",
            date: new Date().toString(),
          },
          undefined,
          2,
        ),
      });
    } else {
      req.respond({
        "status": 500,
      });
    }
  }
}

declare const self: Worker;

self.onmessage = async (e: MessageEvent) => {
  const { port } = e.data;
  runServer(port);
};
