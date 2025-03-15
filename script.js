const canvas = document.getElementById("garden");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src =
  "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmRmNXI2bnN1dWY3YXRtYnViZWVrb3RuejJkZW15bnY0ZGo5aHpuNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPiQlhna3B3yL4c/giphy.gif";

img.onload = function () {
  console.log("image loaded");
};

const flower = document.getElementById("flower");
const tree = document.getElementById("tree");

let flowerActive = false;
let treeActive = false;

flower.onclick = function () {
  console.log("flower");
  flowerActive = !flowerActive;

  flower.classList.toggle("active", flowerActive);
};

tree.onclick = function () {
  console.log("tree");
  treeActive = !treeActive;

  tree.classList.toggle("active", treeActive);
};

canvas.addEventListener("click", (e) => {
  if (!img.complete) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  console.log(rect, x, y);

  ctx.drawImage(img, x, y, 20, 10);

  if (flowerActive) {
    ctx.fillText("🌸", x, y);
  }
});

const download = document.getElementById("download");
download.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "garden.png";
  link.href = canvas.toDataURL();
  link.click();
});
