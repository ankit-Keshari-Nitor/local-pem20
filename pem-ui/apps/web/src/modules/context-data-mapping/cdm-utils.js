// cdm-utils.js
/* eslint-disable array-callback-return */

const generateContextDataMapping = (storeData) => {
  return Object.keys(storeData).map((task) => {
    const value = storeData[task];

    if (value.pType) {
      return {
        name: task,
        type: value.pType,
        data: { type: value.pType }
      };
    } else {
      return {
        name: task,
        type: '',
        data: { type: value.pType },
        items: generateContextDataMapping(value)
      };
    }
  });
};

const transformDataToTree = (data, parentKey = '${') => {
  const transformDataChildren = (data, parentKey) => {
    return Object.entries(data).map(([key, value]) => {
      const dataNodeId = `${parentKey}/text()}`;
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
      const nodeId = `${parentKey}/${item.name}`;
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

      if (item.data && item.data.type !== 'TEXT' && item.data.type !== undefined && typeof item.data === 'object') {
        treeNode.children = treeNode.children.concat(transformDataChildren(item.data, nodeId));
      }

      return treeNode;
    })
  );
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
          label: `${key} [${value.pType === 'TEXT' ? value.pValue : value.pType + ' : ' + (value.pValue || '')}]`,
          type: value.pType,
          value: {
            type: value.pType,
            name: key,
            value: value.pValue || ''
          }
        };
      } else {
        return {
          id: currentPath,
          label: `${key} [${value.pValue || ''}]`,
          type: 'TEXT',
          value: {
            type: 'TEXT',
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


const updateTreeNodeIcon = (treeData, iconMap) => {
  treeData.forEach((treeNode) => {
    treeNode.icon = iconMap[treeNode.type];
    if (treeNode.children) {
      updateTreeNodeIcon(treeNode.children, iconMap);
    }
  });
};

module.exports = { generateContextDataMapping, transformDataToTree, generateTreeData, updateTreeNodeIcon };
