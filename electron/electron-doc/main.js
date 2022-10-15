const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

const createWindow = () => {
  const mainWin = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  ipcMain.handle("ping", () => "pong");

  mainWin.loadFile("index.html");
};

function handleSetTitle(event, title) {
  // Get the window through event sender
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);

  // Set the browser window title
  win.setTitle(title);
}

app.whenReady().then(() => {
  createWindow();

  // Set a listener to setTitle channel
  ipcMain.on("setTitle", handleSetTitle);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows.length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
