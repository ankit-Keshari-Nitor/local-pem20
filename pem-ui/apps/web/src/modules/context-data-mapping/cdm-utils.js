// cdm-utils.js
/* eslint-disable array-callback-return */

const generateContextDataMapping = (storeData) => {
  const generateContextDataMappingChildern = (value) => {
    // If the value is an object with nested data, recurse to map its properties
    if (typeof value === 'object' && value !== null) {
      return Object.keys(value).map((key) => {
        const item = value[key];

        // If pType exists, return a simple object with its type and data
        if (item.pType) {
          // If pValue is empty, bind value to an empty string, otherwise use the actual pValue
          const data = {
            type: item.pType,
            value: item.pValue !== undefined ? item.pValue : ""
          };

          return {
            name: key,
            type: item.pType,
            data: data
          };
        } else {
          // If pType is not defined, treat it as a category and recurse
          return {
            name: key,
            type: '',
            data: { type: 'CATEGORY' },
            items: generateContextDataMappingChildern(item) // Recursively map child items
          };
        }
      });
    }
    return [];
  };

  // Start by processing the entire storeData object, which could have multiple top-level keys like "application"
  return [{
    name: "ProcessData",
    type: '',
    data: { type: "CATEGORY" },
    items: [/* {
      name: "ParticipantActivityKey",
      type: '',
      data: { type: "SUBCATEGORY" },
      items: []
    }, */ {
        name: "ContextData",
        type: '',
        data: { type: "CATEGORY" },
        items: generateContextDataMappingChildern(storeData) // Pass storeData directly for mapping
      }]
  }];
};

const transformDataToTree = (data, parentKey = '') => {
  const transformDataChildren = (data, parentKey) => {
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
  };

  return (
    data !== 'undefined' &&
    data?.map((item) => {
      const itemName = item.name === 'ProcessData' || item.name === 'ContextData' ? `${item.name.charAt(0).toLowerCase()}${item.name.slice(1)}` : `${item.name}`
      const nodeId = parentKey !== "" ? `${parentKey}.${itemName}` : itemName;
      const { items, data, ...itemProps } = item;
      const treeNode = {
        id: nodeId && nodeId,
        title: `${item.name}`,
        type: item.type,
        value: itemProps,
        children: []
      };

      if (item.items) {
        treeNode.children = transformDataToTree(item.items, nodeId);
      }

      if (item.data && item.data.type !== 'TEXT' && item.data.type !== 'SUBCATEGORY' && item.data.type !== 'API_CONFIG' && item.data.type !== 'LOGO_FILE' && item.data.type !== 'ACTIVITY_FILE' && item.data.type !== 'CATEGORY' && item.data.type !== undefined && typeof item.data === 'object') {
        treeNode.children = treeNode.children.concat(transformDataChildren(item.data, nodeId));
      }

      return treeNode;
    })
  );
};

const transformDataToTreeBasedOnType = (data, type, parentKey = '') => {
  return data.map((item) => {
    const itemName = item.name === 'ProcessData' || item.name === 'ContextData' ? `${item.name.charAt(0).toLowerCase()}${item.name.slice(1)}` : `${item.name}`
    const nodeId = parentKey !== "" ? `${parentKey}.${itemName}` : itemName;

    if (item.type === type || item.data?.type === "CATEGORY") {
      const treeNode = {
        id: nodeId + '.pValue',
        title: item.name,
        type: item.type || item.data.type,
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
      if (value.pType) {
        return {
          id: currentPath,
          label: `${key} [${value.pType === 'TEXT' ? value.pValue : value.pType + (value.pValue ? ' : ' + value.pValue : '')}]`,
          type: value.pType,
          value: {
            type: value.pType,
            name: key,
            value: value.pType === 'OBJECT' ? '' : (value.pValue || '')
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
