const stage = new Konva.Stage({
  container: "garden",
  width: 270,
  height: 480,
});

// ********** URL **********

const baseURL =
  "https://raw.githubusercontent.com/jlimsy/virtual-garden/refs/heads/main/assets/";

const elementsURL = {
  logo: `${baseURL}logo.svg`,
  monstera: `${baseURL}008_monstera.svg`,
  rose: `${baseURL}009_rose.svg`,
  ranunculus: `${baseURL}010_ranunculus.svg`,
};

// ********** SET THE BACKGROUND COLOR **********

const layer = new Konva.Layer();
stage.add(layer);

const background = new Konva.Rect({
  x: 0,
  y: 0,
  width: stage.width(),
  height: stage.height(),
  fill: "#c5d6e0",
  strokeWidth: 4,
});
layer.add(background);

// ********** SELECT BG COLOR **********

const colors = {
  blue: "#c5d6e0",
  pink: "#f0d3d3",
  ivory: "#dfd6d1",
  cream: "blanchedalmond",
  green: "#c0cfb2",
};

let blueActive = false;
let pinkActive = false;
let ivoryActive = false;
let creamActive = false;
let greenActive = false;

const blue = document.getElementById("blue");
const pink = document.getElementById("pink");
const ivory = document.getElementById("ivory");
const cream = document.getElementById("cream");
const green = document.getElementById("green");

blue.onclick = function () {
  blueActive = true;

  if (blueActive) {
    pinkActive = ivoryActive = creamActive = greenActive = false;
    background.fill(colors.blue);
  }

  updateButtons();
};

pink.onclick = function () {
  pinkActive = true;

  if (pinkActive) {
    blueActive = ivoryActive = creamActive = greenActive = false;
    background.fill(colors.pink);
  }

  updateButtons();
};

ivory.onclick = function () {
  ivoryActive = true;

  if (ivoryActive) {
    blueActive = pinkActive = creamActive = greenActive = false;
    background.fill(colors.ivory);
  }

  updateButtons();
};

cream.onclick = function () {
  creamActive = true;

  if (creamActive) {
    blueActive = pinkActive = ivoryActive = greenActive = false;
    background.fill(colors.cream);
  }

  updateButtons();
};

green.onclick = function () {
  greenActive = true;

  if (greenActive) {
    blueActive = pinkActive = ivoryActive = creamActive = false;
    background.fill(colors.green);
  }

  updateButtons();
};

function updateButtons() {
  [blue, pink, ivory, cream, green].forEach((btn) =>
    btn.classList.remove("active")
  );

  if (blueActive) blue.classList.add("active");
  if (pinkActive) pink.classList.add("active");
  if (ivoryActive) ivory.classList.add("active");
  if (creamActive) cream.classList.add("active");
  if (greenActive) green.classList.add("active");

  layer.draw();
}

// ********** LOGO **********

const logo = elementsURL.logo;
Konva.Image.fromURL(logo, (imageNode) => {
  layer.add(imageNode);
  imageNode.setAttrs({
    name: "logo",
  });

  const scaleFactor = 0.25;

  imageNode.scale({
    x: scaleFactor,
    y: scaleFactor,
  });

  const stageWidth = layer.getStage().width();
  const stageHeight = layer.getStage().height();

  // Set anchor point to center of image
  imageNode.offsetX(imageNode.width() / 2);
  imageNode.offsetY(imageNode.height() / 2);

  imageNode.position({
    x: stageWidth / 2,
    y: stageHeight - 25,
  });

  layer.draw();
});

// ********** ELEMENTS **********

let circleActive = false;

const circle = new Konva.Circle({
  x: stage.width() / 2,
  y: stage.height() / 2,
  radius: 100,
  fill: "ivory",
  draggable: true,
  name: "circle",
});
layer.add(circle);

let ranunculusActive = false;
let roseActive = false;
let monsteraActive = false;

const RANUNCULUS = elementsURL.ranunculus;
Konva.Image.fromURL(RANUNCULUS, (imageNode) => {
  if (ranunculusActive) {
    ranunculusActive = false;
  }
  layer.add(imageNode);
  imageNode.setAttrs({
    draggable: true,
    name: "ranunculus",
  });

  const scaleFactor = 2;
  imageNode.scale({ x: scaleFactor, y: scaleFactor });
});

const ROSE = elementsURL.rose;
Konva.Image.fromURL(ROSE, (imageNode) => {
  layer.add(imageNode);
  imageNode.setAttrs({
    draggable: true,
    name: "rose",
  });

  const scaleFactor = 2;
  imageNode.scale({ x: scaleFactor, y: scaleFactor });
});

const MONSTERA = elementsURL.monstera;
Konva.Image.fromURL(MONSTERA, (imageNode) => {
  layer.add(imageNode);
  imageNode.setAttrs({
    draggable: true,
    name: "monstera",
  });

  const scaleFactor = 1.25;
  imageNode.scale({ x: scaleFactor, y: scaleFactor });
});

// ********** DRAG, ROTATE & SCALE **********

const tr = new Konva.Transformer();
layer.add(tr);

let selectionRectangle = new Konva.Rect({
  fill: "rgba(0,0,255,0.5)",
  visible: false,
});
layer.add(selectionRectangle);

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

const updateCanvas = () => {
  console.log("updateCanvas", flowerActive, treeActive);

  if (flowerActive && flowerNode) {
    // addImage();
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
