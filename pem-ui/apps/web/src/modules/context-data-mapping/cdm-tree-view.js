// cdm-tree-view.js
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { TreeView, TreeNode } from '@carbon/react';

const renderTreeNodes = (nodes) => {
  return nodes.map((node) => {
    return node.children.length > 0 ? (
      <TreeNode key={node.id} id={node.id} label={node.title} type={node.type} value={node.value}>
        {renderTreeNodes(node.children)}
      </TreeNode>
    ) : (
      <TreeNode key={node.id} id={node.id} label={node.title} type={node.type} value={node.value}></TreeNode>
    );
  });
};

const CDMTreeView = ({ data, onSelect }) => {
  const [treeData, setTreeData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    setTreeData(renderTreeNodes(data));
  }, [data]);

  return (
    <>
      <TreeView
        label="Context Data"
        hideLabel={true}
        onSelect={(event, selectedNode) => {
          setSelectedNode(selectedNode.activeNodeId);
          if (onSelect) {
            onSelect(event, selectedNode);
          }
        }}
      >
        {treeData}
      </TreeView>
    </>
  );
};

export default CDMTreeView;
