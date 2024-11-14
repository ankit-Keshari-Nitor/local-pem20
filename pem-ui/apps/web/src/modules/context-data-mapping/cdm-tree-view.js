/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { TreeView, TreeNode } from '@carbon/react';

// Recursive function to render tree nodes
const renderTreeNodes = (nodes, expandedNodes, toggleNodeExpansion, setSelectedNode, onSelect) => {
  return nodes.map((node) => {
    const isExpanded = expandedNodes.includes(node.id);

    return node.children && node.children.length > 0 ? (
      <TreeNode
        key={node.id}
        id={node.id}
        label={node.title}
        type={node.type}
        value={node.value}
        isExpanded={isExpanded}
        onToggle={() => toggleNodeExpansion(node.id)}
      >
        {renderTreeNodes(node.children, expandedNodes, toggleNodeExpansion, setSelectedNode, onSelect)} {/* Recursive call for children */}
      </TreeNode>
    ) : (
      <TreeNode
        key={node.id}
        id={node.id}
        label={node.title}
        type={node.type}
        value={node.value}
        isExpanded={isExpanded}
        onSelect={(event, selectedNode) => {
          setSelectedNode(event, selectedNode.id);
          toggleNodeExpansion(node.id); // Keep this node expanded after selection
          if (onSelect) {
            onSelect(event, selectedNode); // Trigger the parent callback
          }
        }}
      />
    );
  });
};

const CDMTreeView = ({ data, onSelect }) => {
  const [treeData, setTreeData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState([]); // Track expanded nodes

  useEffect(() => {
    if (data) {
      setTreeData(renderTreeNodes(data, expandedNodes, toggleNodeExpansion, setSelectedNode, onSelect));
    }
  }, [data, expandedNodes, onSelect]);

  // Toggle expansion of a node
  const toggleNodeExpansion = (nodeId) => {
    setExpandedNodes((prevExpandedNodes) =>
      prevExpandedNodes.includes(nodeId)
        ? prevExpandedNodes.filter((id) => id !== nodeId) // Collapse if already expanded
        : [...prevExpandedNodes, nodeId] // Expand if not already expanded
    );
  };

  return (
    <div className="cdm-treeView-wrapper" >
      <TreeView label="Context Data" hideLabel={true}>
        {treeData}
      </TreeView>
    </div>
  );
};

export default CDMTreeView;
