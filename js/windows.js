// Window manager
let zIndexCounter = 20;

/**
 * Creates an iframe-based window (for apps/sites you own).
 */
function createWindow(appId, title, url) {
  const win = document.createElement("div");
  win.className = "window";
  win.style.top = "100px";
  win.style.left = "200px";
  win.style.width = "400px";
  win.style.height = "300px";

  // Title bar
  const titleBar = document.createElement("div");
  titleBar.className = "title-bar";
  
  // Left: window title text
  const titleText = document.createElement("div");
  titleText.className = "title-text";
  titleText.innerText = title;

  // Right: buttons container
  const buttons = document.createElement("div");
  buttons.className = "title-buttons";

  titleBar.appendChild(titleText);  // goes left
  titleBar.appendChild(buttons);    // goes right

  // Minimize button
  const minBtn = document.createElement("button");
  minBtn.innerText = "–";
  minBtn.onclick = () => win.style.display = "none";

  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.innerText = "X";

  // Content
  const content = document.createElement("div");
  content.className = "window-content";
  content.innerHTML = `<iframe src="${url}"></iframe>`;

  // Assemble
  buttons.appendChild(minBtn);
  buttons.appendChild(closeBtn);
  titleBar.appendChild(buttons);
  win.appendChild(titleBar);
  win.appendChild(content);
  document.getElementById("windows").appendChild(win);

  // Resize handles
  addResizeHandles(win);

  // Taskbar button
  const taskbarBtn = Taskbar.add(appId, title, win);

  // Close button behavior
  closeBtn.onclick = () => {
    win.remove();
    taskbarBtn.remove();
  };

  // Dragging
  enableDragging(win, titleBar);

  // Bring to front
  win.onmousedown = () => bringToFront(win);
}

/**
 * Creates a simple info-only window (text + OK button).
 */
function createInfoWindow(appId, title, message) {
  const win = document.createElement("div");
  win.className = "window";
  win.style.top = "120px";
  win.style.left = "220px";
  win.style.width = "420px";
  win.style.height = "auto";

  // Title bar
  const titleBar = document.createElement("div");
  titleBar.className = "title-bar";
  titleBar.innerHTML = `<span>${title}</span>`;

  const buttons = document.createElement("div");
  buttons.className = "title-buttons";

  const closeBtn = document.createElement("button");
  closeBtn.innerText = "X";
  buttons.appendChild(closeBtn);
  titleBar.appendChild(buttons);

  // Content
  const content = document.createElement("div");
  content.className = "window-content";
  content.innerHTML = `
    <p>${message}</p>
    <div style="text-align: right; margin-top: 12px;">
      <button class="ok-btn">OK</button>
    </div>
  `;

  win.appendChild(titleBar);
  win.appendChild(content);
  document.getElementById("windows").appendChild(win);

  // Resize handles
  addResizeHandles(win);

  // Taskbar button
  const taskbarBtn = Taskbar.add(appId, title, win);

  // Close behaviors
  closeBtn.onclick = () => {
    win.remove();
    taskbarBtn.remove();
  };
  content.querySelector(".ok-btn").onclick = () => {
    win.remove();
    taskbarBtn.remove();
  };

  // Dragging
  enableDragging(win, titleBar);

  // Bring to front
  win.onmousedown = () => bringToFront(win);
}

/**
 * Helpers
 */

// Add resize handles to a window
function addResizeHandles(win) {
  const handles = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];
  handles.forEach(dir => {
    const handle = document.createElement("div");
    handle.className = `resize-handle ${dir}`;
    win.appendChild(handle);

    handle.addEventListener("mousedown", e => {
      e.preventDefault();
      e.stopPropagation();

      const iframe = win.querySelector("iframe");
      if (iframe) iframe.style.pointerEvents = "none"; // disable during resize

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

        if (dir.includes("e")) newWidth = Math.max(200, startWidth + (e2.clientX - startX));
        if (dir.includes("s")) newHeight = Math.max(150, startHeight + (e2.clientY - startY));
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
        if (iframe) iframe.style.pointerEvents = "auto";
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });
  });
}

// Enable dragging a window by its title bar
function enableDragging(win, titleBar) {
  let offsetX, offsetY;
  titleBar.onmousedown = e => {
    const iframe = win.querySelector("iframe");
    if (iframe) iframe.style.pointerEvents = "none"; // disable during drag

    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;

    function dragMove(e2) {
      win.style.left = (e2.clientX - offsetX) + "px";
      win.style.top = (e2.clientY - offsetY) + "px";
    }

    function stopDrag() {
      if (iframe) iframe.style.pointerEvents = "auto"; // re-enable after drag
      document.removeEventListener("mousemove", dragMove);
      document.removeEventListener("mouseup", stopDrag);
    }

    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", stopDrag);
  };
}

// Bring a window to the front
function bringToFront(win) {
  zIndexCounter++;
  win.style.zIndex = zIndexCounter;
}

/**
 * Opens app windows based on appId
 */
function openApp(appId) {
  if (appId === "subscribe") {
    // 🔥 Custom subscribe window
    const win = document.createElement("div");
    win.className = "window";
    win.style.top = "140px";
    win.style.left = "240px";
    win.style.width = "420px";
    win.style.height = "auto";

    // Title bar
    const titleBar = document.createElement("div");
    titleBar.className = "title-bar";
    titleBar.innerHTML = `<span>Subscribe</span>`;
    const buttons = document.createElement("div");
    buttons.className = "title-buttons";
    const closeBtn = document.createElement("button");
    closeBtn.innerText = "X";
    buttons.appendChild(closeBtn);
    titleBar.appendChild(buttons);

    // Content
    const content = document.createElement("div");
    content.className = "window-content";
    content.innerHTML = `
      <form id="signup-form" class="signup-form">
        <input type="email" name="email" placeholder="Enter your email." required>
        <button type="submit">JOIN</button>
      </form>
      <div id="form-message" class="message"></div>
    `;

    win.appendChild(titleBar);
    win.appendChild(content);
    document.getElementById("windows").appendChild(win);

    // Resize handles
    addResizeHandles(win);

    // Taskbar button
    const taskbarBtn = Taskbar.add(appId, "Subscribe", win);

    // Close button
    closeBtn.onclick = () => {
      win.remove();
      taskbarBtn.remove();
    };

    // Dragging
    enableDragging(win, titleBar);

    // Bring to front
    win.onmousedown = () => bringToFront(win);

    // 🔥 Signup form script binding
    const form = content.querySelector("#signup-form");
    const message = content.querySelector("#form-message");
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      const data = new FormData(form);
      message.textContent = "Submitting...";
      fetch("https://script.google.com/macros/s/AKfycbwYKJJ9bi1lIolTYu56ZAKvm7P9YgerzIEiUaJftqLONNhNmnO8M2e4xy71SlK30AAg/exec", {
        method: "POST",
        body: data
      }).then(() => {
        message.textContent = "Success.";
        form.reset();
      }).catch(() => {
        message.textContent = "Failure. Please try again.";
      });
    });
  }
}
