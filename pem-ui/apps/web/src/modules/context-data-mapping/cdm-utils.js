// cdm-utils.js
/* eslint-disable array-callback-return */

const generateContextDataMapping = (storeData, nodeData) => {
  // Helper to map properties of nested objects
  const mapNestedProperties = (value) => {
    if (typeof value === 'object' && value !== null) {
      return Object.keys(value).map(key => {
        const item = value[key];

        if (item.type) {
          return {
            name: key,
            type: item.type,
            data: {
              type: item.type,
              value: item.value !== undefined ? item.value : ""
            }
          };
        } else {
          return {
            name: key,
            type: '',
            data: { type: 'CATEGORY' },
            items: mapNestedProperties(item) // Recursive call for children
          };
        }
      });
    }
    return [];
  };

  // Helper to process form data into a mapping structure
  const mapFormData = (formData) => {
    return formData.flatMap(row => row.cType === "ROW"
      ? row.children.flatMap(column => column.cType === "COLUMN"
        ? column.children.map(child => mapFormControl(child))
        : [])
      : []
    );
  };

  // Map individual form controls
  const mapFormControl = (child) => {
    const controlTypeMap = {
      "LABEL": "LABEL",
      "TEXT_INPUT": "TEXT_INPUT",
      "TEXTAREA": "TEXTAREA",
      "CHECKBOX": "CHECKBOX",
      "DROPDOWN": "DROPDOWN"
    };
    return controlTypeMap[child.cType] ? {
      id: child.id,
      name: `${child.cType}[${child.props.name}]`,
      type: controlTypeMap[child.cType],
    } : null;
  };

  // Helper to map node data into a hierarchical structure
  const mapNodeData = (nodeData) => {
    return nodeData?.filter(node => !['START', 'END', 'BRANCH_START', 'BRANCH_END'].includes(node.type))
      .map(node => createNodeMapping(node));
  };

  // Create a node mapping
  const createNodeMapping = (node) => {
    const { data, type } = node;
    const nodeMapping = {
      name: data.id,
      type: ['PARTNER', 'SPONSOR'].includes(type) ? 'TASK_NODE' : 'DIALOG_NODE',
      items: [],
    };

    if (data.dialogNodes?.length) {
      nodeMapping.items = mapNodeData(data.dialogNodes);
    }

    if (data?.form?.children?.length) {
      nodeMapping.items = [{
        name: "FormData",
        type: '',
        data: { type: "CATEGORY" },
        items: mapFormData(data.form.children[0].children),
      }];
    }

    return nodeMapping;
  };

  // Main context mapping
  return [{
    name: "ProcessData",
    type: '',
    data: { type: "CATEGORY" },
    items: [
      {
        name: "ContextData",
        type: '',
        data: { type: "CATEGORY" },
        items: mapNestedProperties(storeData),
      },
      ...(nodeData ? mapNodeData(nodeData) : []),
    ],
  }];
};

// Helper to format the name of each item
const getFormattedItemName = (item) => {
  // First, handle special cases for 'ProcessData', 'ContextData', and 'FormData'
  if (['ProcessData', 'ContextData', 'FormData'].includes(item.name)) {
    return item.name.charAt(0).toLowerCase() + item.name.slice(1); // Make the first letter lowercase
  }

  // Handle form control names, like 'TEXTAREA[form-control]' -> 'form-control'
  if (item.name && item.name.includes('[')) {
    const nameParts = item.name.split('[');
    return nameParts[1]?.slice(0, -1) || nameParts[0]; // Remove the closing bracket and return the inner name
  }

  // If none of the above conditions match, just return the original name
  return item.name;
};

const transformDataToTree = (data, parentKey = '') => {
  /* const transformDataChildren = (data, parentKey) => {
    return Object.entries(data).map(([key, value]) => {
      const dataNodeId = `${parentKey}`;
      const titleValue = value !== undefined ? value : 'binding';
      const dataNode = {
        id: dataNodeId,
        title: `${key}`,
        type: `${titleValue}`,
        children: []
      };

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        dataNode.children = transformDataChildren(value, dataNodeId);
      } else if (Array.isArray(value)) {
        dataNode.children = value.map((item, index) => {
          const arrayNodeId = `${dataNodeId}[${index}]${item.type}`;

          return {
            id: arrayNodeId,
            title: `[${index}]`,
            type: item.type,
            children: item && typeof item === 'object' ? transformDataChildren(item, arrayNodeId) : []
          };
        });
      }

      return dataNode;
    });
  }; */

  return data?.map(item => {
    const itemName = getFormattedItemName(item);
    const nodeId = parentKey ? `${parentKey}.${itemName}` : itemName;
    const { items, data, ...itemProps } = item;

    const treeNode = {
      id: data?.type !== "CATEGORY" ? `${nodeId}.value` : nodeId,
      title: item.name,
      type: item.type,
      value: itemProps,
      children: [],
    };

    if (items) {
      treeNode.children = transformDataToTree(items, nodeId);
    }

    return treeNode;
  }) || [];
};

const transformDataToTreeBasedOnType = (data, type, parentKey = '') => {
  return data.map((item) => {
    const itemName = getFormattedItemName(item);
    const nodeId = parentKey !== "" ? `${parentKey}.${itemName}` : itemName;
    if (item.type === type || item.data?.type === "CATEGORY") {
      const treeNode = {
        id: nodeId + '.value',
        title: item.name,
        type: item.type || item.data.type,
        value: item?.data?.value,
        children: []
      };

      // Process 'items' array if it exists
      if (item.items && Array.isArray(item.items)) {
        treeNode.children = item.items.map(child => {

          return transformDataToTreeBasedOnType([child], type, nodeId)[0];
        }).filter(Boolean);
      }

      return treeNode;
    }

    return null;
  }).filter(Boolean); // Filter out null entries from the top level
};


const generateTreeData = (definition, path = '$') => {
  return Object.keys(definition).map((key) => {
    const value = definition[key];
    const currentPath = `${path}.${key}`;

    if (Array.isArray(value)) {
      return {
        id: currentPath,
        label: key,
        type: 'ARRAY',
        value: {
          type: 'ARRAY',
          name: key,
          value: ''
        },
        children: value.map((item, index) => ({
          id: `${currentPath}[${index}]`,
          label: String(index),
          type: 'ARRAY_ITEM',
          value: {
            type: 'ARRAY_ITEM',
            name: key,
            value: ''
          },
          children: generateTreeData(item, `${currentPath}[${index}]`)
        }))
      };
    } else if (typeof value === 'object' && value !== null) {
      if (value.type) {
        return {
          id: currentPath,
          label: `${key} [${value.type === 'TEXT' ? value.value : value.type + (value.value ? ' : ' + value.value : '')}]`,
          type: value.type,
          value: {
            type: value.type,
            name: key,
            value: value.type === 'OBJECT' ? '' : (value.value || '')
          }
        };
      } else {
        return {
          id: currentPath,
          label: `${key}`,
          type: 'OBJECT',
          value: {
            type: 'OBJECT',
            name: key,
            value: ''
          },
          children: generateTreeData(value, currentPath)
        };
      }
    }
    return null;
  }).filter(item => item !== null); // Remove nulls if necessary
};

const generateMappingTreeData = (definition, path = '$') => {
  return Object.keys(definition).map((key) => {
    const value = definition[key];
    const currentPath = `${path}.${key}`;

    if (typeof value === 'object' && value !== null) {
      if (value) {
        return {
          id: currentPath,
          label: key,
          type: "OBJECT",
          value: {
            name: key,
            value: value || ''
          },
          children: generateMappingTreeData(value, currentPath)
        };
      }
    } else {
      return {
        id: currentPath,
        label: `${key} ${value !== "" ? '[ ' + value + ' ]' : ''}`,
        value: {
          name: key,
          value: value || ''
        }
      };
    }
  });
};

const updateTreeNodeIcon = (treeData, iconMap) => {
  treeData.forEach((treeNode) => {
    treeNode.icon = iconMap[treeNode.type];
    if (treeNode.children) {
      updateTreeNodeIcon(treeNode.children, iconMap);
    }
  });
};

module.exports = { generateContextDataMapping, generateMappingTreeData, transformDataToTree, generateTreeData, updateTreeNodeIcon, transformDataToTreeBasedOnType };
