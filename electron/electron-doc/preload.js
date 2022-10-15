const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => {
    return ipcRenderer.invoke("ping");
  },
  setTitleRenderer: (title) => {
    // Send a message through setTitle channel
    return ipcRenderer.send("setTitle", title);
  },
});
