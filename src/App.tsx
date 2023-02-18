import React, { useRef, useEffect, useState } from "react";
import Node from "./Components/Node";
import "./App.css";
import { GraphType, NodeType } from "./types";
import { aStar } from "./algorithms/aStar";

const createGraphWithWalls = (graph: GraphType) => {
  return graph.map((arr) => {
    return arr.slice();
  });
};

const createGraph = (row: number, col: number) => {
  const graph: GraphType = new Array(row)
    .fill(null)
    .map(() => new Array(col).fill("node"));
  graph[2][2] = "start";
  graph[row - 3][col - 3] = "finish";
  return graph;
};

function useVisualizer(graph: GraphType, algorithm: any) {
  const [displayedGraph, setGraph] = useState<GraphType>(graph);
  const [done, setDone] = useState(true);
  const eachRefStep = useRef(() => {});
  useEffect(() => {
    let newGraph = graph.map((arr) => {
      return arr.slice();
    });
    setDone(false);
    setGraph(newGraph);
    const generator = algorithm(newGraph, setGraph, 2, 2, 16, 37);
    function step() {
      const result = generator.next();
      if (result.done) {
        setDone(true);
      } else {
        newGraph = newGraph.map((arr) => {
          return arr.slice();
        });
        const i = result.value[1] as number;
        const j = result.value[2] as number;
        newGraph[i][j] = result.value[0] as NodeType;
        setGraph(newGraph);
      }
    }
    eachRefStep.current = step;
  }, [graph, algorithm]);
  return { eachRefStep, displayedGraph, done };
}

function App() {
  const [isMouseDown, setMouseDown] = useState<boolean>(false);
  const [graph, setGraph] = useState<GraphType>(createGraph(19, 40));
  const [algorithm] = useState(() => aStar);
  const { eachRefStep, displayedGraph, done } = useVisualizer(graph, algorithm);
  const [playing, setPlay] = useState(false);
  const clearGraph = () => {
    setGraph(createGraph(19, 40));
    setPlay(false);
  };
  const updatePlay = () => {
    setPlay(!playing);
  };
  const abort = () => {
    if (!playing) {
      setGraph(createGraphWithWalls(graph));
    }
  };
  useEffect(() => {
    if (!done && playing) {
      let taskId = window.setInterval(() => {
        eachRefStep.current();
      }, 1000 / 30);
      return () => window.clearInterval(taskId);
    } else if (done) {
      setPlay(false);
    }
  }, [done, eachRefStep, playing]);

  return (
    <div
      className="main"
      onMouseDown={() => setMouseDown(true)}
      onMouseUp={() => setMouseDown(false)}
    >
      {displayedGraph.map((nodeList, i) => {
        return nodeList.map((node, j) => {
          return (
            <Node
              key={`node-${i}-${j}`}
              mouseDown={isMouseDown}
              type={node}
              i={i}
              j={j}
              graph={graph}
              playing={playing}
              setGraph={setGraph}
            />
          );
        });
      })}
      <button onClick={updatePlay}>play</button>
      <button onClick={abort}>abort</button>
      <button onClick={clearGraph}>clear</button>
    </div>
  );
}

export default App;
