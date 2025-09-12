// Handles persistence of icons & window states
const Storage = {
  saveIconPositions() {
    const icons = [...document.querySelectorAll('.icon')].map(icon => ({
      id: icon.dataset.app,
      top: icon.style.top,
      left: icon.style.left
    }));
    localStorage.setItem("iconPositions", JSON.stringify(icons));
  },
  loadIconPositions() {
    const icons = JSON.parse(localStorage.getItem("iconPositions") || "[]");
    icons.forEach(pos => {
      const icon = document.querySelector(`.icon[data-app="${pos.id}"]`);
      if (icon) {
        icon.style.top = pos.top;
        icon.style.left = pos.left;
      }
    });
  }
};
