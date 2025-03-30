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
  hibiscus: `${baseURL}013_hibiscus.svg`,
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

// ********** CIRCLE **********

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

// circle.hide();

// ********** GARDEN PLANTS **********

const RANUNCULUS = elementsURL.ranunculus;
const ROSE = elementsURL.rose;
const MONSTERA = elementsURL.monstera;
const HIBISCUS = elementsURL.hibiscus;

let ranunculusActive = false;
let roseActive = false;
let monsteraActive = false;
let hibiscusActive = false;

// Adjust scale factor based on device size
function getScaleFactor(customSmallScale, customLargeScale) {
  const screenWidth = window.innerWidth;
  let scaleFactor;

  if (screenWidth <= 480) {
    scaleFactor = customSmallScale;
  } else if (screenWidth <= 1024) {
    scaleFactor = 0.5;
  } else {
    scaleFactor = customLargeScale;
  }

  return scaleFactor;
}

const addSVG = (plant, customSmallScale, customLargeScale, show) => {
  Konva.Image.fromURL(plant, (imageNode) => {
    imageNode.setAttrs({
      draggable: true,
      name: `${plant.toLowerCase()}`,
    });

    const scaleFactor = getScaleFactor(customSmallScale, customLargeScale);
    imageNode.scale({ x: scaleFactor, y: scaleFactor });

    const stageWidth = layer.getStage().width();
    const stageHeight = layer.getStage().height();

    imageNode.offsetX(imageNode.width() / 2);
    imageNode.offsetY(imageNode.height() / 2);

    imageNode.position({
      x: stageWidth / 2,
      y: stageHeight / 2,
    });

    layer.add(imageNode);
  });
};

// Konva.Image.fromURL(RANUNCULUS, (imageNode) => {
//   imageNode.setAttrs({
//     draggable: true,
//     name: "ranunculus",
//   });

//   const scaleFactor = getScaleFactor(0.2, 2);
//   imageNode.scale({ x: scaleFactor, y: scaleFactor });

//   layer.add(imageNode);
// });

// Konva.Image.fromURL(ROSE, (imageNode) => {
//   layer.add(imageNode);
//   imageNode.setAttrs({
//     draggable: true,
//     name: "rose",
//   });

//   const scaleFactor = getScaleFactor(0.35, 2);
//   imageNode.scale({ x: scaleFactor, y: scaleFactor });
// });

// Konva.Image.fromURL(MONSTERA, (imageNode) => {
//   layer.add(imageNode);
//   imageNode.setAttrs({
//     draggable: true,
//     name: "monstera",
//   });

//   const scaleFactor = getScaleFactor(0.25, 1.25);
//   imageNode.scale({ x: scaleFactor, y: scaleFactor });
// });

// Konva.Image.fromURL(HIBISCUS, (imageNode) => {
//   layer.add(imageNode);
//   imageNode.setAttrs({
//     draggable: true,
//     name: "monstera",
//   });

//   const scaleFactor = getScaleFactor(0.25, 1.25);
//   imageNode.scale({ x: scaleFactor, y: scaleFactor });
// });

// ********** TOOLBOX ITEMS **********

const ranunculusButton = document.getElementById("ranunculus");
const roseButton = document.getElementById("rose");
const monsteraButton = document.getElementById("monstera");
const hibiscusButton = document.getElementById("hibiscus");

ranunculusButton.onclick = function () {
  ranunculusActive = !ranunculusActive;
  ranunculusButton.classList.toggle("active", ranunculusActive);

  addSVG(RANUNCULUS, 0.2, 2, ranunculusActive);
};

roseButton.onclick = function () {
  roseActive = !roseActive;
  roseButton.classList.toggle("active", roseActive);

  addSVG(ROSE, 0.35, 2, roseActive);
};

monsteraButton.onclick = function () {
  monsteraActive = !monsteraActive;
  monsteraButton.classList.toggle("active", monsteraButton);

  addSVG(MONSTERA, 0.25, 1.25, monsteraActive);
};

hibiscusButton.onclick = function () {
  hibiscusActive = !hibiscusActive;
  hibiscusButton.classList.toggle("active", hibiscusActive);

  addSVG(HIBISCUS, 0.25, 1.25, hibiscusActive);
};

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

  x1 = stage.getPointerPosition().x;
  y1 = stage.getPointerPosition().y;
  x2 = stage.getPointerPosition().x;
  y2 = stage.getPointerPosition().y;

  selectionRectangle.visible(true);
  selectionRectangle.width(0);
  selectionRectangle.height(0);
});

stage.on("mousemove touchmove", () => {
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
  if (!selectionRectangle.visible()) {
    return;
  }
  setTimeout(() => {
    selectionRectangle.visible(false);
  });

  const elements = stage.find("Shape").filter((shape) => shape.draggable());

  const box = selectionRectangle.getClientRect();
  const selected = elements.filter((shape) =>
    Konva.Util.haveIntersection(box, shape.getClientRect())
  );
  tr.nodes(selected);
});

stage.on("click tap", function (e) {
  if (selectionRectangle.visible()) {
    return;
  }

  if (e.target === stage) {
    tr.nodes([]);
    return;
  }

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
    const nodes = tr.nodes().concat([e.target]);
    tr.nodes(nodes);
  }
});

// Click outside stage to remove nodes

document.addEventListener("click", function (e) {
  const clickedOnStage = stage.getContainer().contains(e.target);

  if (!clickedOnStage) {
    tr.nodes([]); // Clear selection
  }
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
