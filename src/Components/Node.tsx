import React, { useEffect, useState } from 'react';
import { NodeType, GraphType } from '../types';

const Node = ({
  mouseDown,
  type,
  graph,
  setGraph,
  i,
  j,
}: {
  mouseDown: boolean;
  type: NodeType;
  setGraph: any;
  graph: GraphType;
  i: number;
  j: number;
}) => {
  const [nodeType, setNodeType] = useState(type);

  useEffect(() => {
    setNodeType(type);
  }, [type]);
  const draggable = () => {
    if (nodeType === 'start' || nodeType === 'finish') {
      return;
    }
    if (mouseDown) {
      if (nodeType === 'node') {
        const newArray = graph.map((arr) => {
          return arr.slice();
        });
        newArray[i][j] = 'wall';
        setGraph(newArray);
      } else {
        const newArray = graph.map((arr) => {
          return arr.slice();
        });
        newArray[i][j] = 'node';
        setGraph(newArray);
      }
    }
  };
  const clickNode = () => {
    if (nodeType === 'start' || nodeType === 'finish') {
      return;
    }
    if (nodeType === 'node') {
      const newArray = graph.map((arr) => {
        return arr.slice();
      });
      newArray[i][j] = 'wall';
      setGraph(newArray);
    } else {
      const newArray = graph.map((arr) => {
        return arr.slice();
      });
      newArray[i][j] = 'node';
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
