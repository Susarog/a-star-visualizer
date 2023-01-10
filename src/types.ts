export type NodeType =
  | 'shortest-path'
  | 'visited'
  | 'wall'
  | 'node'
  | 'start'
  | 'finish';

export type GraphType = Array<NodeType[]>;
