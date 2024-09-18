const getContextDataMappingsForDialog = (dialog) => {
  const context = {};

  const processNode = (node, currentLevel) => {
    if (node.props && node.props.outputBinding) {
      const outputBindingPath = node.props.outputBinding.split('.');
      outputBindingPath.forEach((key, index) => {
        if (!currentLevel[key]) {
          currentLevel[key] = index === outputBindingPath.length - 1 ? '' : {};
        }
        currentLevel = currentLevel[key];
      });
    }

    if (node.children) {
      node.children.forEach((child) => processNode(child, currentLevel));
    }
  };

  dialog.forEach((node) => processNode(node, context));

  return context;
};

const generateContextDataMapping = (activitySchema) => {
  const contextDataMappingData = { items: [] };

  activitySchema.tasks.forEach((task) => {
    const taskData = {
      name: task.name,
      type: task.type,
      items: []
    };

    task.subTasks &&
      task.subTasks.forEach((subTask) => {
        const dialogContext = getContextDataMappingsForDialog(subTask.jsonSchema || []);

        const subTaskData = {
          name: subTask.name,
          type: subTask.type,
          data: dialogContext
        };

        taskData.items.push(subTaskData);
      });

    contextDataMappingData.items.push(taskData);
  });

  return contextDataMappingData;
};

const transformDataToTree = (data, parentKey = '$') => {
  const transformDataChildren = (data, parentKey) => {
    return Object.entries(data).map(([key, value]) => {
      const dataNodeId = `${parentKey}.${key}`;
      const dataNode = {
        id: dataNodeId,
        title: `${key} (binding)`,
        type: 'binding',
        children: []
      };

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        dataNode.children = transformDataChildren(value, dataNodeId);
      } else if (Array.isArray(value)) {
        dataNode.children = value.map((item, index) => {
          const arrayNodeId = `${dataNodeId}[${index}]`;
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

  return data.map((item) => {
    const nodeId = `${parentKey}.items[?(@.name==="${item.name}")]`;
    const { items, data, ...itemProps } = item;
    const treeNode = {
      id: nodeId,
      title: `${item.name}`,
      type: item.type,
      value: itemProps,
      children: []
    };

    if (item.items) {
      treeNode.children = transformDataToTree(item.items, nodeId);
    }

    if (item.data && typeof item.data === 'object') {
      treeNode.children = treeNode.children.concat(transformDataChildren(item.data, nodeId + '.data'));
    }

    return treeNode;
  });
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
          label: key,
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
          label: key,
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

module.exports = { generateContextDataMapping, transformDataToTree, generateTreeData, updateTreeNodeIcon };
