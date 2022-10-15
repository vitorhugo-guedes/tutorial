const infoParagraph = document.getElementById("info");

// Basic tutorial
infoParagraph.innerText = `
Chrome: ${electronAPI.chrome()}
Node: ${electronAPI.node()}
Electron: ${electronAPI.electron()}
`;
const func = async () => {
  const response = await window.electronAPI.ping();
  console.log(response);
};
func();

// Renderer to Main: One-way IPC pattern
const setTitleBtn = document.getElementById("setTitleBtn");
const titleInput = document.getElementById("title");

// Send title to Main process
setTitleBtn.addEventListener("click", () => {
  const title = titleInput.value;
  window.electronAPI.setTitleRenderer(title);
});

// Renderer to Main: Two-way IPC pattern
const openFileBtn = document.getElementById("openFileBtn");
const filePathEl = document.getElementById("filePath");

openFileBtn.addEventListener("click", async () => {
  // Call openFile and get the path from selected file
  const filePath = await window.electronAPI.openFile();
  filePathEl.innerText = filePath;
});

// Main to Renderer IPC pattern
const counter = document.getElementById("counter");

window.electronAPI.handleCounter((ev, value) => {
  const prevValue = Number(counter.innerText);
  const newValue = prevValue + value;
  counter.innerText = newValue;
  ev.sender.send("counter-value", newValue);
});
