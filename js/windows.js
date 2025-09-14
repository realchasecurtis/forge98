// =============================
// Window manager
// =============================
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

  // Minimize button
  const minBtn = document.createElement("button");
  minBtn.innerText = "–";
  minBtn.onclick = () => win.style.display = "none";

  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.innerText = "X";

  buttons.appendChild(minBtn);
  buttons.appendChild(closeBtn);

  titleBar.appendChild(titleText);
  titleBar.appendChild(buttons);

  // Content
  const content = document.createElement("div");
  content.className = "window-content";
  content.innerHTML = `<iframe src="${url}"></iframe>`;

  // Assemble
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
 * Creates a generic info window (text or custom HTML).
 */
function createInfoWindow(appId, title, htmlContent) {
  const win = document.createElement("div");
  win.className = "window";
  win.style.top = "120px";
  win.style.left = "220px";
  win.style.width = "420px";
  win.style.height = "auto";

  // Title bar
  const titleBar = document.createElement("div");
  titleBar.className = "title-bar";

  const titleText = document.createElement("div");
  titleText.className = "title-text";
  titleText.innerText = title;

  const buttons = document.createElement("div");
  buttons.className = "title-buttons";

  const closeBtn = document.createElement("button");
  closeBtn.innerText = "X";

  buttons.appendChild(closeBtn);
  titleBar.appendChild(titleText);
  titleBar.appendChild(buttons);

  // Content
  const content = document.createElement("div");
  content.className = "window-content";
  content.innerHTML = htmlContent;

  win.appendChild(titleBar);
  win.appendChild(content);
  document.getElementById("windows").appendChild(win);

  // Resize handles
  addResizeHandles(win);

  // Taskbar button
  const taskbarBtn = Taskbar.add(appId, title, win);

  // Close behavior
  closeBtn.onclick = () => {
    win.remove();
    taskbarBtn.remove();
  };

  // Dragging
  enableDragging(win, titleBar);

  // Bring to front
  win.onmousedown = () => bringToFront(win);

  return win; // ✅ return for further customization
}

// =============================
// Helpers
// =============================
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
      if (iframe) iframe.style.pointerEvents = "none";

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

function enableDragging(win, titleBar) {
  let offsetX, offsetY;
  titleBar.onmousedown = e => {
    const iframe = win.querySelector("iframe");
    if (iframe) iframe.style.pointerEvents = "none";

    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;

    function dragMove(e2) {
      win.style.left = (e2.clientX - offsetX) + "px";
      win.style.top = (e2.clientY - offsetY) + "px";
    }

    function stopDrag() {
      if (iframe) iframe.style.pointerEvents = "auto";
      document.removeEventListener("mousemove", dragMove);
      document.removeEventListener("mouseup", stopDrag);
    }

    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", stopDrag);
  };
}

function bringToFront(win) {
  zIndexCounter++;
  win.style.zIndex = zIndexCounter;
}

// =============================
// App router
// =============================
function openApp(appId) {
  if (appId === "mail") {
    // Use info window with subscription form
    const win = createInfoWindow(
      "mail",
      "Subscribe",
      `
        <form id="signup-form" class="signup-form">
          <input type="email" name="email" placeholder="Enter your email." required>
          <button type="submit">JOIN</button>
        </form>
        <div id="form-message" class="message"></div>
      `
    );

    // Hook form logic inside window
    const form = win.querySelector("#signup-form");
    const message = win.querySelector("#form-message");

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

// =============================
// App router
// =============================
function openApp(appId) {
  switch (appId) {
    case "halo":
      createWindow("halo", "Halo", "https://halo.forgebunker.com");
      break;

    case "osrs":
      createWindow("osrs", "OSRS", "https://osrs.forgebunker.com");
      break;

    case "mail":
      // Use info window with subscription form
      const win = createInfoWindow(
        "mail",
        "Subscribe",
        `
          <form id="signup-form" class="signup-form">
            <input type="email" name="email" placeholder="Enter your email." required>
            <button type="submit">JOIN</button>
          </form>
          <div id="form-message" class="message"></div>
        `
      );

      // Hook form logic inside window
      const form = win.querySelector("#signup-form");
      const message = win.querySelector("#form-message");

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
      break;

    default:
      console.warn(`No app registered for id: ${appId}`);
  }
}
