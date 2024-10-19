import { HTWK_YELLOW } from "../UI/Color";

export const drawStreets = (
  buildingContainer: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  projection: d3.GeoProjection,
) => {
  const gustavFreytagStr: [number, number][] = [
    [12.3714, 51.31268],
    [12.3765, 51.31268],
  ];
  addStreet(buildingContainer, projection, gustavFreytagStr);

  const eichendorfStr: [number, number][] = [
    [12.3714, 51.31375],
    [12.3765, 51.31375],
  ];
  addStreet(buildingContainer, projection, eichendorfStr);

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
    .attr("stroke", "#ffffff66")
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
  addEntrance(buildingContainer, projection([12.37588, 51.313069]) ?? [0, 0], 90); // b north
  addEntrance(buildingContainer, projection([12.3757, 51.3131]) ?? [0, 0], 270); // l building
  addEntrance(buildingContainer, projection([12.375845, 51.31342]) ?? [0, 0]); // c building
  addEntrance(buildingContainer, projection([12.37598, 51.313575]) ?? [0, 0], 180); // eichamt

  // NI
  addEntrance(buildingContainer, projection([12.373, 51.313028]) ?? [0, 0], 270);

  // FÖ
  addEntrance(buildingContainer, projection([12.371765, 51.31447]) ?? [0, 0], 180); // north
  addEntrance(buildingContainer, projection([12.37182, 51.31382]) ?? [0, 0]); // south
};

const addEntrance = (
  buildingContainer: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  position: [number, number],
  rotation: number = 0,
) => {
  const [x, y] = position;
  const size = 150;

  const polygon = buildingContainer
    .append("polygon")
    .attr("points", `${x},${y - size} ${x - size},${y + size} ${x + size},${y + size}`)
    .attr("fill", HTWK_YELLOW)
    .attr("stroke", HTWK_YELLOW)
    .attr("stroke-width", 1)
    .attr("stroke-linecap", "round")
    .attr("stroke-linejoin", "round");

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
