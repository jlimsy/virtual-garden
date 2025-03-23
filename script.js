const stage = new Konva.Stage({
  container: "garden",
  width: 270,
  height: 480,
});

// ********** SET THE BACKGROUND COLOR **********

const layer = new Konva.Layer();
stage.add(layer);

const background = new Konva.Rect({
  x: 0,
  y: 0,
  width: stage.width(),
  height: stage.height(),
  fill: "green",
  stroke: "black",
  strokeWidth: 4,
});

layer.add(background);

const circle = new Konva.Circle({
  x: stage.width() / 2,
  y: stage.height() / 2,
  radius: 100,
  fill: "red",
  draggable: true,
});
layer.add(circle);

// ********** TOOLBOX ITEMS **********

const flower = document.getElementById("flower");
const tree = document.getElementById("tree");

let flowerActive = false;
let treeActive = false;

flower.onclick = function () {
  flowerActive = !flowerActive;

  flower.classList.toggle("active", flowerActive);
  updateCanvas();
};

tree.onclick = function () {
  console.log("tree");
  treeActive = !treeActive;

  tree.classList.toggle("active", treeActive);
};

// ********** ADDING THE IMAGES **********

const imageObj = new Image();
imageObj.src = "assets/teachersday.png";

let flowerNode = null;

imageObj.onload = function () {
  flowerNode = new Konva.Image({
    x: 50,
    y: 50,
    image: imageObj,
    draggable: true,
  });
};

const updateCanvas = () => {
  console.log("updateCanvas", flowerActive, treeActive);

  if (flowerActive && flowerNode) {
    layer.add(flowerNode);
  }
};

const download = document.getElementById("download");
download.addEventListener("click", () => {
  const dataURL = stage.toDataURL({
    pixelRatio: 2,
  });

  const link = document.createElement("a");
  link.download = "garden.png";
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
