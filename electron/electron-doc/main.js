const { app, BrowserWindow, ipcMain, dialog, Menu } = require("electron");
const path = require("path");

// Renderer to Main: One-way IPC pattern
function handleSetTitle(event, title) {
  // Get the window through event sender
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);

  // Set the browser window title
  win.setTitle(title);
}

// Renderer to Main: Two-way IPC pattern
async function handleFileOpen() {
  // call showOpenDialog function and get the filepath
  const { canceled, filePaths } = await dialog.showOpenDialog();

  if (canceled) {
    return;
  } else {
    // returns the path from selected file
    return filePaths[0];
  }
}

const createWindow = () => {
  const mainWin = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Main to Renderer IPC pattern
  const menu = Menu.buildFromTemplate([
    {
      label: "Counter Menu",
      submenu: [
        {
          click: () => mainWin.webContents.send("update-counter", 1),
          label: "increment",
        },
        {
          click: () => mainWin.webContents.send("update-counter", -1),
          label: "decrement",
        },
      ],
    },
  ]);

  ipcMain.handle("ping", () => "pong");

  Menu.setApplicationMenu(menu);
  mainWin.loadFile("index.html");

  mainWin.webContents.openDevTools();
};

app.whenReady().then(() => {
  // Handle invoke in dialog:openFile channel and call handleFileOpen
  ipcMain.handle("dialog:openFile", handleFileOpen);

  ipcMain.on("counter-value", (_ev, value) => {
    console.log(value);
  });

  createWindow();

  // Listen to setTitle channel and call handleSetTitle
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
