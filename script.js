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

// ********** ROTATE & SCALE **********

const tr = new Konva.Transformer();
layer.add(tr);

let selectionRectangle = new Konva.Rect({
  fill: "rgba(0,0,255,0.5)",
  visible: false,
});
layer.add(selectionRectangle);

let x1, y1, x2, y2;
stage.on("mousedown touchstart", (e) => {
  if (e.target !== stage) {
    return;
  }
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

  var shapes = stage.find(".rect");
  var box = selectionRectangle.getClientRect();
  var selected = shapes.filter((shape) =>
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
  if (!e.target.hasName("rect")) {
    return;
  }

  // do we pressed shift or ctrl?
  const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
  const isSelected = tr.nodes().indexOf(e.target) >= 0;

  if (!metaPressed && !isSelected) {
    // if no key pressed and the node is not selected
    // select just one
    tr.nodes([e.target]);
  } else if (metaPressed && isSelected) {
    // if we pressed keys and node was selected
    // we need to remove it from selection:
    const nodes = tr.nodes().slice(); // use slice to have new copy of array
    // remove node from array
    nodes.splice(nodes.indexOf(e.target), 1);
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
