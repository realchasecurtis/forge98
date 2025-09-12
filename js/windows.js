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

  const minBtn = document.createElement("button");
  minBtn.innerText = "–";
  minBtn.onclick = () => {
    win.style.display = "none";
  };

  const closeBtn = document.createElement("button");
  closeBtn.innerText = "X";
  closeBtn.onclick = () => {
    win.remove();
  };

  buttons.appendChild(minBtn);
  buttons.appendChild(closeBtn);
  titleBar.appendChild(buttons);

  const content = document.createElement("div");
  content.className = "window-content";
  content.innerHTML = `<iframe src="${url}"></iframe>`;

  win.appendChild(titleBar);
  win.appendChild(content);

  document.getElementById("windows").appendChild(win);

  // Dragging
  let offsetX, offsetY;
  titleBar.onmousedown = e => {
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    document.onmousemove = e2 => {
      win.style.left = (e2.clientX - offsetX) + "px";
      win.style.top = (e2.clientY - offsetY) + "px";
    };
    document.onmouseup = () => {
      document.onmousemove = null;
    };
  };

  // Bring to front
  win.onmousedown = () => {
    zIndexCounter++;
    win.style.zIndex = zIndexCounter;
  };

  Taskbar.add(appId, title, win);
}
