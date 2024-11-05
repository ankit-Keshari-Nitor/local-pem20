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

module.exports = { generateTreeData };
