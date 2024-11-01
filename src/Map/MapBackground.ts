import { HTWK_YELLOW } from "../UI/Color";

export const drawStreets = (
  buildingContainer: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  projection: d3.GeoProjection,
) => {
  const gustavFreytagStrL: [number, number][] = [
    [12.3714, 51.31268],
    [12.37318, 51.31268],
  ];
  addStreet(buildingContainer, projection, gustavFreytagStrL);

  const gustavFreytagStrR: [number, number][] = [
    [12.37328, 51.31268],
    [12.3765, 51.31268],
  ];
  addStreet(buildingContainer, projection, gustavFreytagStrR);

  const eichendorfStrL: [number, number][] = [
    [12.3714, 51.31375],
    [12.37318, 51.31375],
  ];
  addStreet(buildingContainer, projection, eichendorfStrL);

  const eichendorfStrR: [number, number][] = [
    [12.37328, 51.31375],
    [12.3765, 51.31375],
  ];
  addStreet(buildingContainer, projection, eichendorfStrR);

  const karlLiebknechtStrL: [number, number][] = [
    [12.37318, 51.3115],
    [12.37318, 51.315],
  ];
  addStreet(buildingContainer, projection, karlLiebknechtStrL);

  const karlLiebknechtStrR: [number, number][] = [
    [12.37328, 51.3115],
    [12.37328, 51.315],
  ];
  addStreet(buildingContainer, projection, karlLiebknechtStrR);

  const trCStr: [number, number][] = [
    [12.3756, 51.31325],
    [12.3756, 51.31375],
  ];
  addStreet(buildingContainer, projection, trCStr);

  const parkingStrR1: [number, number][] = [
    [12.37561, 51.31247],
    [12.37561, 51.31268],
  ];
  addStreet(buildingContainer, projection, parkingStrR1);

  const parkingStrL1: [number, number][] = [
    [12.37547, 51.31247],
    [12.37547, 51.31268],
  ];
  addStreet(buildingContainer, projection, parkingStrL1);

  const parkingStrR2: [number, number][] = [
    [12.37561, 51.3122],
    [12.37561, 51.31233],
  ];
  addStreet(buildingContainer, projection, parkingStrR2);

  const parkingStrL2: [number, number][] = [
    [12.37547, 51.3122],
    [12.37547, 51.31233],
  ];
  addStreet(buildingContainer, projection, parkingStrL2);
};

const addStreet = (
  buildingContainer: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  projection: d3.GeoProjection,
  streetCoordinates: [number, number][],
) => {
  const points = streetCoordinates
    .map(projection)
    .map((p) => (p ? p.join(",") : ""))
    .join(" ");
  buildingContainer
    .append("polyline")
    .attr("points", points)
    .attr("stroke", "#76797a")
    .attr("stroke-width", 300)
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round");
};

export const drawEntrances = (
  buildingContainer: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  projection: d3.GeoProjection,
) => {
  // LI
  addEntrance(buildingContainer, projection([12.37353, 51.31321]) ?? [0, 0], 90); // main entrance
  addEntrance(buildingContainer, projection([12.37375, 51.31272]) ?? [0, 0]); // south entrance
  addEntrance(buildingContainer, projection([12.37375, 51.3137]) ?? [0, 0], 180); // north-west entrance
  addEntrance(buildingContainer, projection([12.37441, 51.3137]) ?? [0, 0], 180); // north-east entrance

  // FE
  addEntrance(buildingContainer, projection([12.374185, 51.31272]) ?? [0, 0]);

  // HB
  addEntrance(buildingContainer, projection([12.37363, 51.31263]) ?? [0, 0], 180);

  // MZ
  addEntrance(buildingContainer, projection([12.37393, 51.3124]) ?? [0, 0], 90);

  // GU
  addEntrance(buildingContainer, projection([12.374985, 51.312563]) ?? [0, 0], 180);

  // GU
  addEntrance(buildingContainer, projection([12.37599, 51.312545]) ?? [0, 0], 180);

  // TR
  addEntrance(buildingContainer, projection([12.3749, 51.312868]) ?? [0, 0], 90); // a west
  addEntrance(buildingContainer, projection([12.37609, 51.31277]) ?? [0, 0]); // a east
  addEntrance(buildingContainer, projection([12.3758, 51.313065]) ?? [0, 0], 180); // a north
  addEntrance(buildingContainer, projection([12.37588, 51.313069]) ?? [0, 0], 90); // b west
  addEntrance(buildingContainer, projection([12.3763, 51.313069]) ?? [0, 0], 270); // b east
  addEntrance(buildingContainer, projection([12.3757, 51.3131]) ?? [0, 0], 270); // l building
  addEntrance(buildingContainer, projection([12.375845, 51.31342]) ?? [0, 0]); // c building
  addEntrance(buildingContainer, projection([12.37598, 51.313575]) ?? [0, 0], 180, true); // eichamt

  // NI
  addEntrance(buildingContainer, projection([12.373, 51.313028]) ?? [0, 0], 270);

  // FÖ
  addEntrance(buildingContainer, projection([12.371765, 51.31447]) ?? [0, 0], 180); // north

  // E2
  addEntrance(buildingContainer, projection([12.37165, 51.31371]) ?? [0, 0], 180);
};

const addEntrance = (
  buildingContainer: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  position: [number, number],
  rotation: number = 0,
  lower: boolean = false,
) => {
  const [x, y] = position;
  const size = 150;

  const polygon = buildingContainer
    .append("polygon")
    .attr("points", `${x},${y - size} ${x - size},${y + size} ${x + size},${y + size}`)
    .attr("stroke", HTWK_YELLOW)
    .attr("stroke-width", 40)
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round");
  lower ? polygon.attr("fill", "transparent") : polygon.attr("fill", HTWK_YELLOW);

  if (rotation !== 0) {
    polygon.attr("transform", `rotate(${rotation}, ${x}, ${y})`);
  }
};

export const drawParkingLots = (
  buildingContainer: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
) => {
  // Beispielkoordinaten und -größen
  const rectX = 19000;
  const rectY = 39000;
  const rectWidth = 11000;
  const rectHeight = 5500;
  const textContent = "P";

  // Rechteck hinzufügen
  buildingContainer
    .append("rect")
    .attr("x", rectX)
    .attr("y", rectY)
    .attr("width", rectWidth)
    .attr("height", rectHeight)
    .attr("fill", "#026bd477");

  // Text hinzufügen
  buildingContainer
    .append("text")
    .attr("x", rectX + rectWidth / 2)
    .attr("y", rectY + rectHeight / 2)
    .attr("dy", ".35em") // Vertikale Ausrichtung
    .attr("text-anchor", "middle") // Horizontale Ausrichtung
    .attr("fill", "white")
    .attr("font-size", "4000px")
    .text(textContent);
};

export const drawNotAccessible = (
  buildingContainer: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
) => {
  addNotAccessible(buildingContainer, 17000, 22300); // LI north-west
  addNotAccessible(buildingContainer, 21300, 22300); // LI north-east
  addNotAccessible(buildingContainer, 16900, 33200); // LI south
  addNotAccessible(buildingContainer, 25000, 34100); // GU
  addNotAccessible(buildingContainer, 23200, 31000); // TR_A west
  addNotAccessible(buildingContainer, 32300, 32800); // TR_A east
};

const addNotAccessible = (
  buildingContainer: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  x: number,
  y: number,
) => {
  buildingContainer
    .append("svg:image")
    .attr("x", x)
    .attr("y", y)
    .attr("width", 700)
    .attr("height", 700)
    .attr("xlink:href", "/Icons/notAccessible.svg");
};
