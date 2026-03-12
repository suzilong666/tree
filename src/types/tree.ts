export interface TreeNode<T = any> {
  [key: string]: any;
  children?: TreeNode<T>[];
}

export type TreeOptions = {
  childrenKey?: string; // 自定义子节点字段名，默认为 'children'
  order?: "pre" | "post"; // 遍历顺序，默认为 'pre'（前序遍历）
};
