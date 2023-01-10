import React, { useState } from 'react';
import Node from './Components/Node';
import './App.css';
import { GraphType } from './types';
import dijkstra from './dijkstra';

const createGraph = (row: number, col: number) => {
  const graph: GraphType = new Array(row)
    .fill(null)
    .map(() => new Array(col).fill('node'));
  graph[2][2] = 'start';
  graph[row - 3][col - 3] = 'finish';
  return graph;
};
function App() {
  const [isMouseDown, setMouseDown] = useState<boolean>(false);
  const [graph, setGraph] = useState<GraphType>(createGraph(19, 40));
  const Temp = () => {
    return graph.map((nodeList, i) => {
      return nodeList.map((node, j) => {
        return (
          <Node
            key={`node-${i}-${j}`}
            mouseDown={isMouseDown}
            type={node}
            i={i}
            j={j}
            graph={graph}
            setGraph={setGraph}
          />
        );
      });
    });
  };

  return (
    <div
      className='main'
      onMouseDown={() => setMouseDown(true)}
      onMouseUp={() => setMouseDown(false)}
    >
      {Temp()}
      <button onClick={() => dijkstra(graph, setGraph, 2, 2)}>dijkstra</button>
      <button onClick={() => setGraph(createGraph(19, 40))}>clear</button>
    </div>
  );
}

export default App;
