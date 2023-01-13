import React, { useEffect, useState } from 'react';
import { NodeType, GraphType } from '../types';

const Node = ({
  mouseDown,
  type,
  graph,
  setGraph,
  i,
  j,
  playing,
}: {
  mouseDown: boolean;
  type: NodeType;
  setGraph: any;
  graph: GraphType;
  i: number;
  j: number;
  playing: boolean;
}) => {
  const [nodeType, setNodeType] = useState(type);

  useEffect(() => {
    setNodeType(type);
  }, [type]);
  const draggable = () => {
    if (playing || nodeType === 'start' || nodeType === 'finish') {
      return;
    }
    if (mouseDown) {
      if (nodeType === 'wall') {
        const newArray = graph.map((arr) => {
          return arr.slice();
        });
        newArray[i][j] = 'node';
        setGraph(newArray);
      } else {
        const newArray = graph.map((arr) => {
          return arr.slice();
        });
        newArray[i][j] = 'wall';
        setGraph(newArray);
      }
    }
  };
  const clickNode = () => {
    if (playing || nodeType === 'start' || nodeType === 'finish') {
      return;
    }
    if (nodeType === 'wall') {
      const newArray = graph.map((arr) => {
        return arr.slice();
      });
      newArray[i][j] = 'node';
      setGraph(newArray);
    } else {
      const newArray = graph.map((arr) => {
        return arr.slice();
      });
      newArray[i][j] = 'wall';
      setGraph(newArray);
    }
  };
  return (
    <div
      className={nodeType}
      draggable={false}
      onMouseOver={draggable}
      onMouseDown={clickNode}
    ></div>
  );
};

export default Node;
