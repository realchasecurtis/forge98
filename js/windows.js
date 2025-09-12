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

  // Add resize handles
  const handles = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];
  handles.forEach(dir => {
    const handle = document.createElement("div");
    handle.className = `resize-handle ${dir}`;
    win.appendChild(handle);

    handle.addEventListener("mousedown", e => {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = win.offsetWidth;
      const startHeight = win.offsetHeight;
      const startTop = win.offsetTop;
      const startLeft = win.offsetLeft;

      function onMouseMove(e2) {
        let newWidth = startWidth;
        let newHeight = startHeight;
        let newTop = startTop;
        let newLeft = startLeft;

        // Resize logic with minimums enforced
        if (dir.includes("e")) {
          newWidth = Math.max(200, startWidth + (e2.clientX - startX));
        }
        if (dir.includes("s")) {
          newHeight = Math.max(150, startHeight + (e2.clientY - startY));
        }
        if (dir.includes("w")) {
          newWidth = Math.max(200, startWidth - (e2.clientX - startX));
          newLeft = startLeft + (e2.clientX - startX);
        }
        if (dir.includes("n")) {
          newHeight = Math.max(150, startHeight - (e2.clientY - startY));
          newTop = startTop + (e2.clientY - startY);
        }

        win.style.width = newWidth + "px";
        win.style.height = newHeight + "px";
        win.style.top = newTop + "px";
        win.style.left = newLeft + "px";
      }

      function onMouseUp() {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  });

  document.getElementById("windows").appendChild(win);

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

  Taskbar.add(appId, title, win);
}
