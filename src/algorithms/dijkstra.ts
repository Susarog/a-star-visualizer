import Heap from 'heap-js';
import { GraphType } from '../types';

const checkRow = (i: number, j: number, graph: GraphType) => {
  if (i < 0 || i >= graph.length || graph[i][j] === 'wall') {
    return false;
  }
  return true;
};

const checkCol = (i: number, j: number, graph: GraphType) => {
  if (j < 0 || j >= graph[0].length || graph[i][j] === 'wall') {
    return false;
  }
  return true;
};
const updateAStarFringe = (
  u: string,
  v: string,
  distance: { [key: string]: number },
  prev: { [key: string]: string | undefined },
  minHeap: Heap<minHeapType>,
  checkedNode: { [key: string]: boolean },
  weight: number
) => {
  if (checkedNode[v]) {
    return;
  }
  const calcDistance = 1 + weight;
  if (calcDistance < distance[v]) {
    distance[v] = calcDistance;
    prev[v] = u;
    minHeap.push({ vertex: v, distance: distance[v] });
  }
};

const updateDijkstraFringe = (
  u: string,
  v: string,
  distance: { [key: string]: number },
  prev: { [key: string]: string | undefined },
  minHeap: Heap<minHeapType>,
  checkedNode: { [key: string]: boolean },
  weight: number
) => {
  if (checkedNode[v]) {
    return;
  }
  const calcDistance = distance[u] + weight;
  if (calcDistance < distance[v]) {
    distance[v] = calcDistance;
    prev[v] = u;
    minHeap.push({ vertex: v, distance: distance[v] });
  }
};

interface minHeapType {
  vertex: string;
  distance: number;
}
function* dijkstra(
  graph: GraphType,
  setGraph: any,
  startRowIndex: number,
  startColIndex: number,
  endRowIndex: number,
  endColIndex: number
) {
  const distance: { [key: string]: number } = {};
  const prev: { [key: string]: string | undefined } = {};
  const checkedNode: { [key: string]: boolean } = {};
  const customPriorityComparator = (a: minHeapType, b: minHeapType) =>
    a.distance - b.distance;
  const minHeap: Heap<minHeapType> = new Heap(customPriorityComparator);
  distance[`${startRowIndex}-${startColIndex}`] = 0;
  graph.forEach((arr, i) => {
    arr.forEach((node, j) => {
      if (node !== 'start' && node !== 'wall') {
        distance[`${i}-${j}`] = Number.MAX_VALUE;
      } else {
        distance[`${i}-${j}`] = 0;
      }
      prev[`${i}-${j}`] = undefined;
      checkedNode[`${i}-${j}`] = false;
    });
  });
  minHeap.push({
    vertex: `${startRowIndex}-${startColIndex}`,
    distance: distance[`${startRowIndex}-${startColIndex}`],
  });

  while (!minHeap.isEmpty()) {
    const currVertex = minHeap.pop() as minHeapType;
    const nodeKey = currVertex.vertex;
    const temp = nodeKey.split('-');
    const i = Number(temp[0]);
    const j = Number(temp[1]);
    if (graph[i][j] === 'finish') {
      break;
    }
    if (checkedNode[nodeKey]) {
      continue;
    }
    if (graph[i][j] !== 'start') {
      yield ['visited', i, j];
    }
    checkedNode[nodeKey] = true;
    if (checkRow(i + 1, j, graph)) {
      updateDijkstraFringe(
        nodeKey,
        `${i + 1}-${j}`,
        distance,
        prev,
        minHeap,
        checkedNode,
        1
      );
    }
    if (checkRow(i - 1, j, graph)) {
      updateDijkstraFringe(
        nodeKey,
        `${i - 1}-${j}`,
        distance,
        prev,
        minHeap,
        checkedNode,
        1
      );
    }
    if (checkCol(i, j + 1, graph)) {
      updateDijkstraFringe(
        nodeKey,
        `${i}-${j + 1}`,
        distance,
        prev,
        minHeap,
        checkedNode,
        1
      );
    }
    if (checkCol(i, j - 1, graph)) {
      updateDijkstraFringe(
        nodeKey,
        `${i}-${j - 1}`,
        distance,
        prev,
        minHeap,
        checkedNode,
        1
      );
    }
  }
  let tempString: string | undefined = prev[`${endRowIndex}-${endColIndex}`];
  const shortestPathArr = [];
  if (!tempString) {
    console.log('there is no path for this grid');
  } else {
    while (tempString && tempString !== `${startRowIndex}-${startColIndex}`) {
      shortestPathArr.push(tempString);
      tempString = prev[tempString];
    }
    const reverseShortestPath = shortestPathArr.reverse();
    for (let index = 0; index < reverseShortestPath.length; index++) {
      const tempString = reverseShortestPath[index];
      const indexes: Array<string> = tempString.split('-');
      const i = Number(indexes[0]);
      const j = Number(indexes[1]);
      yield ['shortest-path', i, j];
    }
  }
}
export default dijkstra;

const distanceFormula = (x1: number, y1: number, x2: number, y2: number) => {
  console.log(
    x1,
    y1,
    x2,
    y2,
    Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  );
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
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
  const checkedNode: { [key: string]: boolean } = {};
  const customPriorityComparator = (a: minHeapType, b: minHeapType) =>
    a.distance - b.distance;
  const minHeap: Heap<minHeapType> = new Heap(customPriorityComparator);
  distance[`${startRowIndex}-${startColIndex}`] = 0;
  graph.forEach((arr, i) => {
    arr.forEach((node, j) => {
      if (node !== 'start' && node !== 'wall') {
        distance[`${i}-${j}`] = Number.MAX_VALUE;
      } else {
        distance[`${i}-${j}`] = 0;
      }
      prev[`${i}-${j}`] = undefined;
      checkedNode[`${i}-${j}`] = false;
    });
  });
  minHeap.push({
    vertex: `${startRowIndex}-${startColIndex}`,
    distance: distance[`${startRowIndex}-${startColIndex}`],
  });

  while (!minHeap.isEmpty()) {
    const currVertex = minHeap.pop() as minHeapType;
    const nodeKey = currVertex.vertex;
    const temp = nodeKey.split('-');
    const i = Number(temp[0]);
    const j = Number(temp[1]);
    if (graph[i][j] === 'finish') {
      break;
    }
    if (checkedNode[nodeKey]) {
      continue;
    }
    if (graph[i][j] !== 'start') {
      yield ['visited', i, j];
    }
    checkedNode[nodeKey] = true;
    if (checkRow(i + 1, j, graph)) {
      updateAStarFringe(
        nodeKey,
        `${i + 1}-${j}`,
        distance,
        prev,
        minHeap,
        checkedNode,
        distanceFormula(j, i + 1, endColIndex, endRowIndex)
      );
    }
    if (checkRow(i - 1, j, graph)) {
      updateAStarFringe(
        nodeKey,
        `${i - 1}-${j}`,
        distance,
        prev,
        minHeap,
        checkedNode,
        distanceFormula(j, i - 1, endColIndex, endRowIndex)
      );
    }
    if (checkCol(i, j + 1, graph)) {
      updateAStarFringe(
        nodeKey,
        `${i}-${j + 1}`,
        distance,
        prev,
        minHeap,
        checkedNode,
        distanceFormula(j + 1, i, endColIndex, endRowIndex)
      );
    }
    if (checkCol(i, j - 1, graph)) {
      updateAStarFringe(
        nodeKey,
        `${i}-${j - 1}`,
        distance,
        prev,
        minHeap,
        checkedNode,
        distanceFormula(j - 1, i, endColIndex, endRowIndex)
      );
    }
  }
  let tempString: string | undefined = prev[`${endRowIndex}-${endColIndex}`];
  const shortestPathArr = [];
  if (!tempString) {
    console.log('there is no path for this grid');
  } else {
    while (tempString && tempString !== `${startRowIndex}-${startColIndex}`) {
      shortestPathArr.push(tempString);
      tempString = prev[tempString];
    }
    const reverseShortestPath = shortestPathArr.reverse();
    for (let index = 0; index < reverseShortestPath.length; index++) {
      const tempString = reverseShortestPath[index];
      const indexes: Array<string> = tempString.split('-');
      const i = Number(indexes[0]);
      const j = Number(indexes[1]);
      yield ['shortest-path', i, j];
    }
  }
}
