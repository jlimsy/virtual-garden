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
  fill: "#BBC397",
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

// ********** TRANSFORMATIONS **********

const tr = new Konva.Transformer();
layer.add(tr);

tr.nodes([circle]);

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

async function loadImageAsBase64(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}

async function addImage() {
  const base64 = await loadImageAsBase64("assets/teachersday.png");
  const image = new Image();
  image.src = base64;
  image.onload = () => {
    const konvaImage = new Konva.Image({
      image: image,
      x: 50,
      y: 50,
      width: 200,
      height: 200,
    });
    layer.add(konvaImage);
    layer.draw();
  };
}

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
    addImage();
    // layer.add(flowerNode);
  }
};

// ********** SVG **********

const SOURCE = "https://konvajs.org/assets/tiger.svg";
Konva.Image.fromURL(SOURCE, (imageNode) => {
  layer.add(imageNode);
  imageNode.setAttrs({
    width: 150,
    height: 150,
    draggable: true,
  });
});

// ********** DOWNLOAD **********

const download = document.getElementById("download");
download.addEventListener("click", () => {
  const dataURL = stage.toDataURL({
    pixelRatio: 3,
  });

  const link = document.createElement("a");
  link.download = "garden.png";
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
