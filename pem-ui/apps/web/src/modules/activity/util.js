import Designer from '@b2bi/flow-designer';
const Nodes_With_SubProcess = ['SYSTEM', 'CUSTOM', 'SPONSOR', 'PARTNER'];
const NODE_DATA = Designer.NODE_TYPES;

// Function to get node specific data
const getNodeSpecificDataObj = (node) => {
  switch (node.type.toUpperCase()) {
    case 'API':
      return {
        description: node.data.editableProps?.description,
        api: {
          apiConfiguration: node.data?.api?.apiConfiguration || '',
          url: node.data?.api?.url || '',
          method: node.data?.api?.method || '',
          requestContentType: node.data?.api?.requestContentType || '',
          responseContentType: node.data?.api?.requestContentType || '',
          file: node.data?.api?.file || '',
          requestHeaders: node.data?.api?.requestHeaders || '',
          request: node.data?.api?.request || '',
          sampleResponse: node.data?.api?.sampleResponse || '',
          response: node.data?.api?.response || ''
        }
      };
    case 'XSLT':
      return {
        description: node.data.editableProps?.description,
        xslt: {
          input: node.data?.xslt?.input,
          xslt: node.data?.xslt?.xslt,
          sampleOutput: node.data?.xslt?.sampleOutput,
          output: node.data?.xslt?.output,
          escapeInput: node.data?.xslt?.escapeInput
        }
      };
    case 'PARTNER':
      let newPartnerObj = {
        description: node.data.editableProps?.description || '',
        userKeys: ''
      };
      if (node.data.editableProps?.estimate_days) {
        newPartnerObj.estimateDays = parseInt(node.data.editableProps?.estimate_days);
      }
      if (node.data.editableProps?.role) {
        newPartnerObj.roleKeys = node.data.editableProps?.role;
      }
      return newPartnerObj;
    case 'SPONSOR':
      let sponsorObj = {
        description: node.data.editableProps?.description,
        userKeys: '',
        showToPartner: node.data.editableProps?.show_to_partner ? node.data.editableProps?.show_to_partner : false
      };
      if (node.data.editableProps?.estimate_days) {
        sponsorObj.estimateDays = parseInt(node.data.editableProps?.estimate_days);
      }
      if (node.data.editableProps?.role) {
        sponsorObj.roleKeys = node.data.editableProps?.role;
      }
      return sponsorObj;
    case 'SYSTEM':
      return {
        description: node.data.editableProps?.description
      };
    case 'GATEWAY':
      return {
        description: node.data.editableProps?.description || '',
        xslt: {
          key: 'value'
        }
      };
    case 'FORM':
      return {
        description: node.data.editableProps?.description || '',
        form: node.data.form,
        loop: {
          loopDataInput: '',
          dataItem: '',
          completionCondition: ''
        }
      };
    case 'CUSTOM':
      return {
        description: node.data.editableProps?.description
      };
    case 'ATTRIBUTE':
    case 'APPROVAL':
      return {
        description: node.data.editableProps?.description || ''
      };
    case 'BRANCH_START':
      return {
        description: 'No UI Support',
        gatewayType: 'branchStart'
      };
    case 'BRANCH_END':
      return {
        description: 'No UI Support',
        gatewayType: 'branchEnd'
      };
    default:
      if (!['END', 'START'].includes(node.type)) {
        return {
          description: node.data.editableProps?.description || ''
        };
      }
      break;
  }
};

// Function to get node data
const nodeObjects = (node, readOnly) => {
  // Modify the Gateway to Branch_start and Branch_end
  const nodeType =
    node.type.toUpperCase() === 'GATEWAY' ? (node.gatewayType === 'branchStart' ? (node.type = 'BRANCH_START') : (node.type = 'BRANCH_END')) : node.type.toUpperCase();
  let data = nodeType === 'START' || nodeType === 'END' ? { readOnly } : { ...NODE_DATA[node.type.toUpperCase()], readOnly };
  let { diagram, id, type, ...rest } = node;
  let newNode = {
    id: id,
    position: {
      x: diagram.x,
      y: diagram.y
    },
    type: type
  };
  if (Nodes_With_SubProcess.includes(nodeType)) {
    data.dialogNodes = node.nodes ? node.nodes : [];
    data.dialogEdges = node.connectors ? node.connectors : [];
  }
  switch (nodeType) {
    case 'PARTNER':
      data.editableProps = {
        name: rest?.name,
        description: rest?.description,
        estimate_days: rest?.estimateDays,
        role: rest?.roleKeys
      };
      break;
    case 'SPONSOR':
      data.editableProps = {
        name: rest?.name,
        description: rest?.description,
        estimate_days: rest?.estimateDays,
        role: rest?.roleKeys,
        show_to_partner: rest?.showToPartner
      };
      break;
    case 'API':
      data.editableProps = {
        name: rest?.name,
        description: rest?.description
      };
      data.api = rest?.api;
      break;
    case 'FORM':
      data.editableProps = { name: rest?.name, description: rest?.description };
      data.form = rest.form;
      break;
    case 'XSLT':
      data.editableProps = { name: rest?.name, description: rest?.description };
      data.xslt = rest?.xslt;
      break;
    case 'DIALOG':
      data.editableProps = {
        name: rest?.name,
        description: rest?.description
      };
      break;
    case 'BRANCH_START':
      data.editableProps = { name: rest?.name, description: rest?.description };
      break;
    case 'GATEWAY':
      data.editableProps = { name: rest?.name, description: rest?.description };
      break;
    default:
      data.editableProps = { name: rest?.name, description: rest?.description };
      break;
  }
  newNode = {
    ...newNode,
    data
  };
  return newNode;
};

// Function to get edge data
const getEdge = (edge, readOnly, nodes, category) => {
  const sourceNodeType = nodes.find((x) => x.id === edge.source)?.type;
  return {
    ...edge,
    type: 'crossEdge',
    sourceHandle: sourceNodeType === 'START' ? 'start-node-right' : '',
    markerEnd: {
      type: 'arrowclosed',
      width: 20,
      height: 20,
      color: '#FF0072'
    },
    data: {
      readOnly: readOnly,
      category: category
    },
    style: {
      stroke: '#000'
    }
  };
};

const getDateFormat = (date) => {
  let month = (date.getMonth() + 1).toString();
  month = month.length > 1 ? month : '0' + month;
  let day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  return date.getFullYear() + '-' + month + '-' + day;
};

// Function to handle the conversion of Conditions that will send to API
const exitConditionObjectForApi = (query) => {
  const { rules, id, not, ...rest } = query;
  const rulesData = rules.map((item) => {
    if (item?.rules) {
      return {
        group: exitConditionObjectForApi(item)
      };
    } else {
      let lhsValue = Array.isArray(item.operator) ? item.operator[0] : '';
      let rhsValue = item.value;
      if (item.field === 'date') {
        lhsValue = Array.isArray(item.operator) ? getDateFormat(lhsValue[0]) : '';
        rhsValue = getDateFormat(rhsValue);
      }
      return {
        rule: {
          dataType: item.field,
          lhs: lhsValue,
          operator: Array.isArray(item.operator) ? item.operator[1] : item.operator,
          rhs: rhsValue
        }
      };
    }
  });
  return {
    ...rest,
    not: not ? not : false,
    rules: rulesData
  };
};

// Function to get condition of all the edges
const getConditions = (source, target, node) => {
  if (node && node.type === 'BRANCH_START') {
    const connectorData = node.data.branchCondition.find((x) => x.target === target);
    return {
      group: connectorData.condition && exitConditionObjectForApi(connectorData?.condition)
    };
  } else {
    return {
      group: node.data.exitValidationQuery && exitConditionObjectForApi(node.data.exitValidationQuery)
    };
  }
};

// Function to handle all the nodes and edges data that will send to API
export const generateNodeEdgesForApi = (nodes, edges, error, level) => {
  const nodesData = nodes.map((node, index) => {
    if (node.type.toUpperCase() === 'BRANCH_START' && node.data.branchCondition.length === 0) {
      error.push({
        error: (level ? 'DialogFlow' : 'TaskFlow') + ': Exclusive Branch Start has no outgoing sequence flow'
      });
    }
    if (node.type.toUpperCase() === 'BRANCH_START' && node.data.branchCondition.length === 1) {
      node.data.branchCondition.map((conditions) => {
        if (conditions.condition.rules.length > 0) {
          error.push({
            error: (level ? 'DialogFlow' : 'TaskFlow') + ': Exclusive Branch Start has not outgoing sequence flow without condition'
          });
        }
        return error;
      });
    }
    if (node.type.toUpperCase() === 'BRANCH_START' && node.data.branchCondition.length > 1) {
      node.data.branchCondition.map((conditions) => {
        if (conditions.condition.rules.length === 0) {
          error.push({
            error: (level ? 'DialogFlow' : 'TaskFlow') + ': Exclusive Branch Start has not outgoing sequence flow without condition'
          });
        }
        return error;
      });
    }
    if (node.type.toUpperCase() === 'FORM' && Object.keys(node.data.form).length === 0) {
      error.push({
        error: (level ? 'DialogFlow' : 'TaskFlow') + ': Form has no elements'
      });
    }
    const nodeObj = {
      id: node.id ? node.id : `${node.type}-${index}`,
      name: ['END', 'START'].includes(node.type) ? `${node.type}` : node.data.editableProps?.name ? node.data.editableProps?.name : node.data.id,
      type: node.type === 'BRANCH_START' || node.type === 'BRANCH_END' ? 'GATEWAY' : node.type,
      diagram: {
        x: node.position.x,
        y: node.position.y
      }
    };
    !['END', 'START'].includes(node.type) && (nodeObj.nodes = []);
    !['END', 'START'].includes(node.type) && (nodeObj.connectors = []);

    const nodeSpecificData = getNodeSpecificDataObj(node);
    if (Nodes_With_SubProcess.includes(node.type.toUpperCase())) {
      if (node.data.dialogNodes) {
        const subProcessData = generateNodeEdgesForApi(node.data.dialogNodes, node.data.dialogEdges, error, true);
        nodeObj.nodes = subProcessData.nodes;
        nodeObj.connectors = subProcessData.edges;
      }
    }
    return { ...nodeObj, ...nodeSpecificData };
  });

  const edgesData = edges.map((edge) => {
    const node = nodes.find((e) => e.id === edge.source);
    if (edge.sourceHandle.includes('start')) {
      return {
        id: edge.id,
        source: edge.source,
        target: edge.target
      };
    } else {
      const condition = getConditions(edge.source, edge.target, node);

      if (condition.group && condition.group.rules && condition.group.rules.length > 0) {
        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          condition: condition
        };
      } else {
        return {
          id: edge.id,
          source: edge.source,
          target: edge.target
        };
      }
    }
  });
  return {
    edges: edgesData,
    nodes: nodesData,
    error: error
  };
};

// Function to handle the conversion of Conditions after getting data from API
const exitConditionObject = ({ group }) => {
  const { rules, ...rest } = group;
  const rulesData = rules.map(({ rule, group }) => {
    if (group) {
      return exitConditionObject({ group });
    }
    const { lhs, rhs, operator, dataType } = rule;
    let lhsValue = lhs;
    let rhsValue = rhs;
    if (dataType.toLowerCase() === 'date') {
      lhsValue = new Date(lhs.replace(/-/g, '/'));
      rhsValue = new Date(rhs.replace(/-/g, '/'));
    }
    return {
      field: dataType.toLowerCase(),
      value: rhsValue,
      valueSource: 'value',
      operator: [lhsValue, operator]
    };
  });

  return {
    ...rest,
    rules: rulesData
  };
};

// function to handle the conversion of Branch condition after getting data from API
const branchConditionObject = (edge, object = []) => {
  // Parse and get the exit condition object from edge.condition
  const condition = exitConditionObject(edge.condition);

  // Update the edge condition with the parsed condition
  edge.condition = condition;
  edge.connectorId = `${edge.source}_to_${edge.target}`;

  // If object array is empty, return an array with the edge
  if (object.length === 0) {
    return [edge];
  }
  // If object array is not empty, concatenate edge to the object array
  return object.concat(edge);
};

// Function to handle conversion of all the nodes and edges data of subprocess getting data from API
const generateActivitySchemaForSubProcess = (taskNode, readOnly) => {
  const newChildNodes = taskNode.nodes.map((node) => {
    return nodeObjects(node, readOnly) || {};  // Return an empty object if undefined
  });
  const childEdges = taskNode.connectors.map((edge) => {
    let nodeIndex = newChildNodes.findIndex((n) => n.id === edge.source);
    if (edge?.condition || newChildNodes[nodeIndex].type === 'BRANCH_START') {
      if (nodeIndex > -1) {
        if (newChildNodes[nodeIndex].type === 'BRANCH_START') {
          if (edge?.condition) {
            newChildNodes[nodeIndex].data.branchCondition = branchConditionObject(edge, newChildNodes[nodeIndex].data?.branchCondition);
          } else {
            // For single outflow from branch (when branch start don't have exit validation)
            edge.condition = {
              group: {
                combinator: 'and',
                not: false,
                rules: []
              }
            };
            newChildNodes[nodeIndex].data.branchCondition = branchConditionObject(edge, newChildNodes[nodeIndex].data?.branchCondition);
          }
        } else {
          newChildNodes[nodeIndex].data.exitValidationQuery = exitConditionObject(edge.condition);
        }
      }
    }
    let edgeObj = getEdge(edge, readOnly, taskNode.nodes, 'dialog');
    return { ...edgeObj, data: { ...edgeObj.data, id: taskNode.id } };
  });

  return { nodes: newChildNodes, edges: childEdges };
};

// Function to handle conversion of all the nodes and edges data getting data from API
export const generateActivitySchema = (nodes, edges, readOnly) => {
  const newNodes = nodes.map((node) => {
    const nodeSpecificData = nodeObjects(node, readOnly);
    if (Nodes_With_SubProcess.includes(node.type.toUpperCase())) {
      if (node.nodes) {
        const subProcessData = generateActivitySchemaForSubProcess(node, readOnly);
        nodeSpecificData.data.dialogNodes = subProcessData.nodes;
        nodeSpecificData.data.dialogEdges = subProcessData.edges;
      }
    }
    return nodeSpecificData;
  });
  const newEdges = edges.map((edge) => {
    let nodeIndex = newNodes.findIndex((n) => n.id === edge.source);
    if (edge?.condition || newNodes[nodeIndex].type === 'BRANCH_START') {
      if (nodeIndex > -1) {
        if (newNodes[nodeIndex].type === 'BRANCH_START') {
          if (edge?.condition) {
            newNodes[nodeIndex].data.branchCondition = branchConditionObject(edge, newNodes[nodeIndex].data?.branchCondition);
          } else {
            // For single outflow from branch (when branch start don't have exit validation)
            edge.condition = {
              group: {
                combinator: 'and',
                not: false,
                rules: []
              }
            };
            newNodes[nodeIndex].data.branchCondition = branchConditionObject(edge, newNodes[nodeIndex].data?.branchCondition);
          }
        } else {
          newNodes[nodeIndex].data.exitValidationQuery = exitConditionObject(edge.condition);
        }
      }
    }
    return getEdge(edge, readOnly, nodes, 'task') || {};  // Ensure return value
  });
  return {
    nodes: newNodes,
    edges: newEdges
  };
};
