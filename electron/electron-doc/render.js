const infoParagraph = document.getElementById("info");

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

const setTitleBtn = document.getElementById("setTitleBtn");
const titleInput = document.getElementById("title");

// Send title to Main process
setTitleBtn.addEventListener("click", () => {
  const title = titleInput.value;
  window.electronAPI.setTitleRenderer(title);
});
