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

// ********** ELEMENTS **********

const circle = new Konva.Circle({
  x: stage.width() / 2,
  y: stage.height() / 2,
  radius: 100,
  fill: "red",
  draggable: true,
  name: "circle",
});
layer.add(circle);

// create rectangle
const rect1 = new Konva.Rect({
  x: 60,
  y: 60,
  width: 100,
  height: 90,
  fill: "red",
  name: "rect",
  draggable: true,
});
layer.add(rect1);

const rect2 = new Konva.Rect({
  x: 250,
  y: 100,
  width: 150,
  height: 90,
  fill: "green",
  name: "rect",
  draggable: true,
});
layer.add(rect2);

const SOURCE = "https://jmp.sh/s/LkLgA40MTzD6VFtJcFLx.svg";
Konva.Image.fromURL(SOURCE, (imageNode) => {
  layer.add(imageNode);
  imageNode.setAttrs({
    width: 150,
    height: 150,
    draggable: true,
    name: "ranunculus",
  });
});

// ********** ROTATE & SCALE **********

const tr = new Konva.Transformer();
layer.add(tr);

let selectionRectangle = new Konva.Rect({
  fill: "rgba(0,0,255,0.5)",
  visible: false,
});
layer.add(selectionRectangle);

console.log("Selection Rectangle", selectionRectangle);
console.log("stage", stage);

let x1, y1, x2, y2;
stage.on("mousedown touchstart", (e) => {
  if (e.target !== stage && e.target !== background) {
    return;
  }

  console.log("mousedown", e.target);
  x1 = stage.getPointerPosition().x;
  y1 = stage.getPointerPosition().y;
  x2 = stage.getPointerPosition().x;
  y2 = stage.getPointerPosition().y;

  selectionRectangle.visible(true);
  selectionRectangle.width(0);
  selectionRectangle.height(0);
});

stage.on("mousemove touchmove", () => {
  // do nothing if we didn't start selection
  if (!selectionRectangle.visible()) {
    return;
  }
  x2 = stage.getPointerPosition().x;
  y2 = stage.getPointerPosition().y;

  selectionRectangle.setAttrs({
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    width: Math.abs(x2 - x1),
    height: Math.abs(y2 - y1),
  });
});

stage.on("mouseup touchend", () => {
  // do nothing if we didn't start selection
  if (!selectionRectangle.visible()) {
    return;
  }
  // update visibility in timeout, so we can check it in click event
  setTimeout(() => {
    selectionRectangle.visible(false);
  });

  const shapes = stage.find("Shape").filter((shape) => shape.draggable());
  console.log("shapes", shapes);
  const box = selectionRectangle.getClientRect();
  const selected = shapes.filter((shape) =>
    Konva.Util.haveIntersection(box, shape.getClientRect())
  );
  tr.nodes(selected);
});

// clicks should select/deselect shapes
stage.on("click tap", function (e) {
  // if we are selecting with rect, do nothing
  if (selectionRectangle.visible()) {
    return;
  }

  // if click on empty area - remove all selections
  if (e.target === stage) {
    tr.nodes([]);
    return;
  }

  // do nothing if clicked NOT on our rectangles
  if (!e.target.draggable()) {
    return;
  }

  const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
  const isSelected = tr.nodes().includes(e.target);

  if (!metaPressed && !isSelected) {
    tr.nodes([e.target]);
  } else if (metaPressed && isSelected) {
    const nodes = tr.nodes().filter((node) => node !== e.target);
    tr.nodes(nodes);
  } else if (metaPressed && !isSelected) {
    // add the node into selection
    const nodes = tr.nodes().concat([e.target]);
    tr.nodes(nodes);
  }
});

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
    // addImage();
    layer.add(flowerNode);
  }
};

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
