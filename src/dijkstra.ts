import Heap from 'heap-js';
import { GraphType } from './types';

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

const updateFringe = (
  u: string,
  v: string,
  distance: { [key: string]: number },
  prev: { [key: string]: string | undefined },
  minHeap: Heap<minHeapType>,
  checkedNode: { [key: string]: boolean }
) => {
  if (checkedNode[v]) {
    return;
  }
  const calcDistance = distance[u] + 1;
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
const dijkstra = (
  graph: GraphType,
  setGraph: any,
  startRowIndex: number,
  startColIndex: number
) => {
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

  // our generator is starting here
  // our generator should not be updating state at all
  // it should yield some values and those values will
  // help change the state of the node components
  // need a vizualizer function that will do all of this for each algorithm.
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
      graph[i][j] = 'visited';
    }
    checkedNode[nodeKey] = true;
    if (checkRow(i + 1, j, graph)) {
      updateFringe(
        nodeKey,
        `${i + 1}-${j}`,
        distance,
        prev,
        minHeap,
        checkedNode
      );
    }
    if (checkRow(i - 1, j, graph)) {
      updateFringe(
        nodeKey,
        `${i - 1}-${j}`,
        distance,
        prev,
        minHeap,
        checkedNode
      );
    }
    if (checkCol(i, j + 1, graph)) {
      updateFringe(
        nodeKey,
        `${i}-${j + 1}`,
        distance,
        prev,
        minHeap,
        checkedNode
      );
    }
    if (checkCol(i, j - 1, graph)) {
      updateFringe(
        nodeKey,
        `${i}-${j - 1}`,
        distance,
        prev,
        minHeap,
        checkedNode
      );
    }
  }
  let tempString: string | undefined = prev['16-37'];
  const newArray = graph.map((arr) => {
    return arr.slice();
  });

  if (!tempString) {
    console.log('there is no path for this grid');
  } else {
    while (tempString && tempString !== '2-2') {
      const indexes: Array<string> = tempString.split('-');
      const i = Number(indexes[0]);
      const j = Number(indexes[1]);
      newArray[i][j] = 'shortest-path';
      tempString = prev[tempString];
    }
  }
  setGraph(newArray);
};
export default dijkstra;
