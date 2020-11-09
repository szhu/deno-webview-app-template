# deno-webview-app-template

A template for making a simple macOS app that has a webview UI. The app starts a HTTP server that the UI use to interact outside of the webview's sandbox.

![Screenshot](https://user-images.githubusercontent.com/1570168/98494419-cf149680-21f1-11eb-96a4-5a5108d059f5.png)

- The UI [webview/webview_deno](https://github.com/webview/webview_deno).
- The server is [deno/std/http](https://deno.land/std/http).

This repo is currently just a proof of concept, but I'm happy to make it more complete -- it should take no longer than a week. If you'd like to use this and want it to be more mature, please open an issue and let me know what your use case is.

## Features

Things it can do:

- Do anything Deno can do.
- Open a single window that shows web content.
- Quit when the window is closed.
- You can choose for the window to have standard window decorations or be borderless. You can choose whether it can be resized.

I don't know yet how to make it do these things:

- Stay open after the window is closed.
- Run in the background, without a Dock icon.
- Have menu items.
- Act as an "Open with" app.
- Probably many other things?

Advantages compared to Electon:

- The distributed app uses less disk space than an Electron app (~50MB vs ~200MB). It uses the system's web engine and doesn't ship with its own.
- Require much less developer tooling than an Electron app -- just clone this repo and install Deno! Perhaps this is where you can start if you want to explore whether your webapp should be a desktop app.

## Usage

### Prerequisites

```sh
brew install deno
```

This has been tested with Deno 1.5.1. `webview` uses unstable Deno features, so the code might break with future versions of Deno will need to be re-adjusted. If you distribute the app with its own copy of Deno, then it's not an issue for users -- just for developers.

### Testing the app

A few options:

- `deno run --no-check -A --unstable app.ts`
  - `bin/run` is an alias for this.
  - Add `--ui` to open the GUI
- Double-click `MyApp.app`.
  - You can see that the entry point `MyApp.app/Contents/MacOS/MyApp` does almost the same thing as the above.

### Distributing

Known issue: `deno_dir/gen/file` contains absolute paths rather than relative ones, which means the app is not completely self-contained yet.

Deno is very self-contained, and makes it easy to make Deno programs self-contained as well. Here are the steps neeeded to make `MyApp.app` self-contained:

- Delete `deno_dir` and run MyApp.app once, just to make we sure we have only the dependecies we need.
- Copy `src` into `MyApp.app/Contents/Resources`.
- Copy the `deno` executable into `MyApp.app/Contents/Resources`.
- Edit `MyApp.app/Contents/MacOS/MyApp` to fix the path to the deno executable and the path of the working dir..
- Change all occurences of MyApp to be the one you want.

These steps should be automated in the future, but they are not hard to do manually.
