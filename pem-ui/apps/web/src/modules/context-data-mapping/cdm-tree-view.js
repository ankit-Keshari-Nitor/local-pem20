/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react';
import { TreeView, TreeNode, Search } from '@carbon/react';

// Recursive function to render tree nodes
const renderTreeNodes = (nodes, expandedNodes, toggleNodeExpansion, setSelectedNode, onSelect) => {
  return nodes.map((node) => {
    const isExpanded = expandedNodes.includes(node.id);

    return node.children && node.children.length > 0 ? (
      <TreeNode key={node.id} id={node.id} label={node.title} type={node.type} value={node.value} isExpanded={isExpanded} onToggle={() => toggleNodeExpansion(node.id)}>
        {renderTreeNodes(node.children, expandedNodes, toggleNodeExpansion, setSelectedNode, onSelect)} {/* Recursive call for children */}
      </TreeNode>
    ) : (node.children.length === 0) & (node.type === 'CATEGORY') ? (
      <TreeNode
        key={node.id}
        id={node.id}
        label={node.title}
        type={node.type}
        value={node.value}
        isExpanded={isExpanded}
        onSelect={(event, selectedNode) => {
          if (onSelect) {
            onSelect(event, 'CATEGORY'); // Trigger the parent callback
          }
        }}
      />
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
  const [searchText, setSearchText] = useState(''); // Track the search input
  const [filteredData, setFilteredData] = useState(data); // Filtered tree data based on search text

  // Use useCallback to memoize the filterTreeData function
  const filterTreeData = useCallback((nodes, searchText) => {
    if (!searchText) {
      return nodes; // No filter applied if search is empty
    }

    return nodes
      .map((node) => {
        const matchesLabel = node.title.toLowerCase().includes(searchText.toLowerCase());
        const filteredChildren = node.children ? filterTreeData(node.children, searchText) : [];

        if (matchesLabel || filteredChildren.length > 0) {
          return { ...node, children: filteredChildren };
        }

        return null;
      })
      .filter(Boolean); // Remove nulls (nodes that do not match)
  }, []);

  useEffect(() => {
    if (data) {
      setFilteredData(filterTreeData(data, searchText));
    }
  }, [data, searchText, filterTreeData]); // Re-run filtering whenever data or searchText changes

  // Toggle expansion of a node
  const toggleNodeExpansion = (nodeId) => {
    setExpandedNodes(
      (prevExpandedNodes) =>
        prevExpandedNodes.includes(nodeId)
          ? prevExpandedNodes.filter((id) => id !== nodeId) // Collapse if already expanded
          : [...prevExpandedNodes, nodeId] // Expand if not already expanded
    );
  };

  return (
    <div className="cdm-treeView-wrapper">
      <div className="heading-wrapper">
        <h4 style={{ margin: 0 }}>Select a Node</h4>
        {/* Search Input */}
        <div className="search-wrapper">
          <Search
            labelText="Search Nodes"
            placeholder="Search by name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onClear={() => setSearchText('')}
            size="md"
          />
        </div>
      </div>
      <TreeView label="Context Data" hideLabel={true}>
        {renderTreeNodes(filteredData, expandedNodes, toggleNodeExpansion, setSelectedNode, onSelect)}
      </TreeView>
    </div>
  );
};

export default CDMTreeView;
