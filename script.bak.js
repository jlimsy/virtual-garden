const canvas = document.getElementById("garden");
const ctx = canvas.getContext("2d");

// const img = new Image();
// img.src = "/assets/teachersday.png"; // cannot use external link because CORS

// img.onload = function () {
//   console.log("image loaded");
// };

const flower = document.getElementById("flower");
const tree = document.getElementById("tree");

let flowerActive = false;
let treeActive = false;

flower.onclick = function () {
  flowerActive = !flowerActive;

  flower.classList.toggle("active", flowerActive);
};

tree.onclick = function () {
  treeActive = !treeActive;

  tree.classList.toggle("active", treeActive);
};

canvas.addEventListener("click", (e) => {
  //   if (!img.complete) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  console.table(rect);
  console.table("clientX", e.clientX, "clientY", e.clientY, "x", x, "y", y);

  //   ctx.drawImage(img, x, y);
  ctx.fillText("hello", x, y);
  ctx.fillRect(x, y, 10, 10);

  if (flowerActive) {
    ctx.fillText("🌸", x, y);
  }

  if (treeActive) {
    ctx.fillText("🌳", x, y);
  }
});

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  console.table(
    "clientX",
    e.clientX,
    "clientY",
    e.clientY,
    "x",
    x,
    "y",
    y,
    "rect.left",
    rect.left,
    "rect.top",
    rect.top
  );
});

const download = document.getElementById("download");
download.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "garden.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});
