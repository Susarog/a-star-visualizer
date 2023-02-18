import Heap from "heap-js";
import { GraphType } from "../types";

const checkRow = (i: number, j: number, graph: GraphType) => {
  if (i < 0 || i >= graph.length || graph[i][j] === "wall") {
    return false;
  }
  return true;
};

const checkCol = (i: number, j: number, graph: GraphType) => {
  if (j < 0 || j >= graph[0].length || graph[i][j] === "wall") {
    return false;
  }
  return true;
};

interface minHeapType {
  vertex: string;
  distance: number;
}

const distanceFormula = (v: string, end: string) => {
  const currCoords = v.split("-");
  const neighborCoords = end.split("-");
  const x1 = Number(currCoords[0]);
  const y1 = Number(currCoords[1]);
  const x2 = Number(neighborCoords[0]);
  const y2 = Number(neighborCoords[1]);
  return Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2);
};

const getNeighbors = (
  i: number,
  j: number,
  graph: GraphType
): Array<string> => {
  const getNeighbors: Array<string> = [];
  if (checkRow(i - 1, j, graph)) {
    getNeighbors.push(`${i - 1}-${j}`);
  }
  if (checkCol(i, j + 1, graph)) {
    getNeighbors.push(`${i}-${j + 1}`);
  }
  if (checkRow(i + 1, j, graph)) {
    getNeighbors.push(`${i + 1}-${j}`);
  }
  if (checkCol(i, j - 1, graph)) {
    getNeighbors.push(`${i}-${j - 1}`);
  }
  return getNeighbors;
};

export function* aStar(
  graph: GraphType,
  setGraph: any,
  startRowIndex: number,
  startColIndex: number,
  endRowIndex: number,
  endColIndex: number
) {
  const distance: { [key: string]: number } = {};
  const prev: { [key: string]: string | undefined } = {};
  const customPriorityComparator = (a: minHeapType, b: minHeapType) =>
    a.distance - b.distance;
  const minHeap: Heap<minHeapType> = new Heap(customPriorityComparator);
  graph.forEach((arr, i) => {
    arr.forEach((node, j) => {
      distance[`${i}-${j}`] = Number.MAX_VALUE;
      prev[`${i}-${j}`] = undefined;
    });
  });
  distance[`${startRowIndex}-${startColIndex}`] = 0;
  minHeap.push({
    vertex: `${startRowIndex}-${startColIndex}`,
    distance: distance[`${startRowIndex}-${startColIndex}`],
  });
  while (!minHeap.isEmpty()) {
    const currVertex = minHeap.pop() as minHeapType;
    const nodeKey = currVertex.vertex;
    const temp = nodeKey.split("-");
    const i = Number(temp[0]);
    const j = Number(temp[1]);
    if (graph[i][j] === "finish") {
      break;
    }
    if (graph[i][j] !== "start") {
      yield ["visited", i, j];
    }
    const neighbors = getNeighbors(i, j, graph);
    neighbors.forEach((neighbor) => {
      const calcDistance = 1 + distance[nodeKey];
      if (calcDistance < distance[neighbor]) {
        prev[neighbor] = nodeKey;
        distance[neighbor] = calcDistance;
        minHeap.push({
          vertex: neighbor,
          distance:
            calcDistance +
            distanceFormula(neighbor, `${endRowIndex}-${endColIndex}`),
        });
      }
    });
  }
  let tempString: string | undefined = prev[`${endRowIndex}-${endColIndex}`];
  const shortestPathArr = [];
  if (!tempString) {
    console.log("there is no path for this grid");
  } else {
    while (tempString && tempString !== `${startRowIndex}-${startColIndex}`) {
      shortestPathArr.push(tempString);
      tempString = prev[tempString];
    }
    const reverseShortestPath = shortestPathArr.reverse();
    for (let index = 0; index < reverseShortestPath.length; index++) {
      const tempString = reverseShortestPath[index];
      const indexes: Array<string> = tempString.split("-");
      const i = Number(indexes[0]);
      const j = Number(indexes[1]);
      yield ["shortest-path", i, j];
    }
  }
}
