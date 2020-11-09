import { WebView } from "https://deno.land/x/webview@0.4.7/mod.ts";
import { parse } from "https://deno.land/std@0.77.0/flags/mod.ts";
import { runServer } from "./serverWorker.ts";

console.log("Hello from app.ts!");

let flags = parse(Deno.args);

// TODO: Use a random free port
let port = flags.port || 8080;
let url = `http://localhost:${port}/?${Math.random()}`;

async function testUrl(url: string) {
  try {
    await fetch(url);
    return true;
  } catch (e) {
    return false;
  }
}

// Set up and start the server.
if (flags.ui) {
  // If we need to start the UI, we need to run the server in a separate thread.
  let worker = new Worker(
    new URL("./serverWorker.ts", import.meta.url).href,
    { type: "module", deno: true },
  );
  worker.postMessage({ port });

  // Wait for the server to be accessible.
  // Otherwise, the webview might start and fail to load the UI.
  while (!await testUrl(url)) {
    // Check every 100ms.
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
} else {
  runServer(port);
}

// Set up and start the UI.
// Derived from https://deno.land/x/webview@0.4.7#example
let webview;
if (flags.ui) {
  webview = new WebView({
    title: "My App",
    url,
    height: 400,
    width: 800,
    resizable: false,
    debug: true,
    frameless: false,
  });
  await webview.run();
  Deno.exit(0);
}
