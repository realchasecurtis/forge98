// Window manager
let zIndexCounter = 20;

function createWindow(appId, title, url) {
  const win = document.createElement("div");
  win.className = "window";
  win.style.top = "100px";
  win.style.left = "200px";

  const titleBar = document.createElement("div");
  titleBar.className = "title-bar";
  titleBar.innerHTML = `<span>${title}</span>`;

  const buttons = document.createElement("div");
  buttons.className = "title-buttons";

  // Minimize button
  const minBtn = document.createElement("button");
  minBtn.innerText = "–";
  minBtn.onclick = () => {
    win.style.display = "none";
  };

  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.innerText = "X";

  const content = document.createElement("div");
  content.className = "window-content";
  content.innerHTML = `<iframe src="${url}"></iframe>`;

  // Assemble window
  buttons.appendChild(minBtn);
  buttons.appendChild(closeBtn);
  titleBar.appendChild(buttons);
  win.appendChild(titleBar);
  win.appendChild(content);

  document.getElementById("windows").appendChild(win);

  // Add taskbar button and keep reference
  const taskbarBtn = Taskbar.add(appId, title, win);

  // Close button removes both window and taskbar item
  closeBtn.onclick = () => {
    win.remove();
    taskbarBtn.remove();
  };

  // Dragging window
  let offsetX, offsetY;
  titleBar.onmousedown = e => {
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;

    function dragMove(e2) {
      win.style.left = (e2.clientX - offsetX) + "px";
      win.style.top = (e2.clientY - offsetY) + "px";
    }

    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", dragMove);
    }, { once: true });
  };

  // Bring to front
  win.onmousedown = () => {
    zIndexCounter++;
    win.style.zIndex = zIndexCounter;
  };
}
