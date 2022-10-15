const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => {
    return ipcRenderer.invoke("ping");
  },
  setTitleRenderer: (title) => {
    // Send a message through setTitle channel (one-way method)
    return ipcRenderer.send("setTitle", title);
  },
  // Send a message through dialog:openFile channel
  // and expects a async response from Main
  openFile: () => ipcRenderer.invoke("dialog:openFile"),

  handleCounter: (callback) => ipcRenderer.on("update-counter", callback),
});
