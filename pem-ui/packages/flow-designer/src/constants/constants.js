import React from 'react';
import {
  PartnerBlockIcon,
  CustomBlockIcon,
  SponsorBlockIcon,
  SystemBlockIcon,
  ApprovalBlockIcon,
  AttributeBlockIcon,
  GatewayBlockIcon,
  FormBlockIcon,
  ApiBlockIcon,
  XsltBlockIcon,
  BranchStartBlockNodeIcon,
  BranchEndBlockNodeIcon
} from '../icons';
import { StartNode, EndNode, GatewayNode, TaskNode, BranchStartNode, BranchEndNode } from './../components/nodes';
import { componentTypes, useFormApi, FormSpy } from '@data-driven-forms/react-form-renderer';
import textField from '@data-driven-forms/carbon-component-mapper/text-field';
import textarea from '@data-driven-forms/carbon-component-mapper/textarea';
import select from '@data-driven-forms/carbon-component-mapper/select';
import checkbox from '@data-driven-forms/carbon-component-mapper/checkbox';
import { Button, Column, Grid } from '@carbon/react';
import CrossEdge from './../components/edges/cross-edge';
import './style.scss';
import { MarkerType, getConnectedEdges } from 'reactflow';

export const CATEGORYS = {
  TASK: 'task',
  DIALOG: 'dialog'
};

export const NODE_TYPE = {
  START: 'START',
  END: 'END',
  PARTNER: 'PARTNER',
  APPROVAL: 'APPROVAL',
  ATTRIBUTE: 'ATTRIBUTE',
  SPONSOR: 'SPONSOR',
  CUSTOM: 'CUSTOM',
  SYSTEM: 'SYSTEM',
  TASK_GATEWAY: 'GATEWAY',
  DIALOG_GATEWAY: 'GATEWAY',
  DIALOG: 'FORM',
  XSLT: 'XSLT',
  API: 'API',
  BRANCH_START: 'BRANCH_START',
  BRANCH_END: 'BRANCH_END'
};

export const NODE_TYPES = {
  [NODE_TYPE.PARTNER]: {
    type: NODE_TYPE.PARTNER,
    shortName: 'Partner',
    borderColor: '#0585FC',
    taskName: 'Partner Task',
    editableProps: {},
    exitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateExitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    exitValidationMessage: '',
    entryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateEntryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    entryValidationMessage: '',
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Copy', action: 'copy' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <PartnerBlockIcon />,
    category: CATEGORYS.TASK,
    active: true
  },
  [NODE_TYPE.APPROVAL]: {
    type: NODE_TYPE.APPROVAL,
    shortName: 'Approval',
    borderColor: '#0585FC',
    taskName: 'Approval Task',
    editableProps: {},
    exitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateExitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    exitValidationMessage: '',
    entryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateEntryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    entryValidationMessage: '',
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Copy', action: 'copy' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <ApprovalBlockIcon />,
    category: CATEGORYS.TASK,
    active: false
  },
  [NODE_TYPE.ATTRIBUTE]: {
    type: NODE_TYPE.ATTRIBUTE,
    shortName: 'Attribute',
    borderColor: '#0585FC',
    taskName: 'Attribute Task',
    editableProps: {},
    exitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateExitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    exitValidationMessage: '',
    entryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateEntryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    entryValidationMessage: '',
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Copy', action: 'copy' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <AttributeBlockIcon />,
    category: CATEGORYS.TASK,
    active: false
  },
  [NODE_TYPE.SPONSOR]: {
    type: NODE_TYPE.SPONSOR,
    shortName: 'Sponsor',
    borderColor: '#0585FC',
    taskName: 'Sponsor Task',
    editableProps: {},
    exitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateExitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    exitValidationMessage: '',
    entryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateEntryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    entryValidationMessage: '',
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Copy', action: 'copy' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <SponsorBlockIcon />,
    category: CATEGORYS.TASK,
    active: true
  },
  [NODE_TYPE.CUSTOM]: {
    type: NODE_TYPE.CUSTOM,
    shortName: 'Custom',
    borderColor: '#0585FC',
    taskName: 'Custom Task',
    editableProps: {},
    exitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateExitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    exitValidationMessage: '',
    entryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateEntryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    entryValidationMessage: '',
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Copy', action: 'copy' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <CustomBlockIcon />,
    category: CATEGORYS.TASK,
    active: false
  },
  [NODE_TYPE.SYSTEM]: {
    type: NODE_TYPE.SYSTEM,
    shortName: 'System',
    borderColor: '#0585FC',
    taskName: 'System Task',
    editableProps: {},
    exitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateExitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    exitValidationMessage: '',
    entryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateEntryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    entryValidationMessage: '',
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Copy', action: 'copy' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <SystemBlockIcon />,
    category: CATEGORYS.TASK,
    active: false
  },
  [NODE_TYPE.TASK_GATEWAY]: {
    type: NODE_TYPE.TASK_GATEWAY,
    shortName: 'Gatway',
    borderColor: '#0585FC',
    taskName: 'Gateway Task',
    editableProps: {
      name: 'Gateway'
    },
    exitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateExitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    exitValidationMessage: '',
    entryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateEntryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    entryValidationMessage: '',
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Copy', action: 'copy' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <GatewayBlockIcon />,
    category: CATEGORYS.TASK,
    active: false
  },
  [NODE_TYPE.DIALOG]: {
    type: NODE_TYPE.DIALOG,
    shortName: 'Form',
    borderColor: '#0585FC',
    taskName: 'Dialog Task',
    editableProps: {},
    exitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateExitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    exitValidationMessage: '',
    entryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateEntryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    entryValidationMessage: '',
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Copy', action: 'copy' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    form: '',
    nodeIcon: <FormBlockIcon />,
    category: CATEGORYS.DIALOG,
    active: true
  },
  [NODE_TYPE.API]: {
    type: NODE_TYPE.API,
    shortName: 'API',
    borderColor: '#0585FC',
    taskName: 'API Task',
    editableProps: {},
    exitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateExitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    exitValidationMessage: '',
    entryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateEntryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    entryValidationMessage: '',
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Copy', action: 'copy' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <ApiBlockIcon />,
    category: CATEGORYS.DIALOG,
    active: true
  },
  [NODE_TYPE.XSLT]: {
    type: NODE_TYPE.XSLT,
    shortName: 'XSLT',
    borderColor: '#0585FC',
    taskName: 'XSLT Task',
    editableProps: {},
    exitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateExitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    exitValidationMessage: '',
    entryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateEntryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    entryValidationMessage: '',
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Copy', action: 'copy' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <XsltBlockIcon />,
    category: CATEGORYS.DIALOG,
    active: true
  },
  [NODE_TYPE.DIALOG_GATEWAY]: {
    type: NODE_TYPE.DIALOG_GATEWAY,
    shortName: 'Gateway',
    borderColor: '#0585FC',
    taskName: 'Gateway Task',
    editableProps: {
      name: 'Gateway'
    },
    exitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateExitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    exitValidationMessage: '',
    entryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateEntryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    entryValidationMessage: '',
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Copy', action: 'copy' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <GatewayBlockIcon />,
    category: CATEGORYS.DIALOG,
    active: true
  },
  [NODE_TYPE.BRANCH_START]: {
    type: NODE_TYPE.BRANCH_START,
    shortName: 'Branch Start',
    borderColor: '#0585FC',
    taskName: 'Branch start Task',
    editableProps: {},
    nodeIcon: <BranchStartBlockNodeIcon />,
    category: CATEGORYS.DIALOG,
    active: true,
    branchCondition: []
  },
  [NODE_TYPE.BRANCH_END]: {
    type: NODE_TYPE.BRANCH_END,
    shortName: 'Branch End',
    borderColor: '#0585FC',
    taskName: 'Branch end Task',
    editableProps: {},
    nodeIcon: <BranchEndBlockNodeIcon />,
    category: CATEGORYS.DIALOG,
    active: true
  }
};

export const CATEGORY_TYPES = {
  [CATEGORYS.TASK]: [
    NODE_TYPES[NODE_TYPE.PARTNER],
    NODE_TYPES[NODE_TYPE.APPROVAL],
    NODE_TYPES[NODE_TYPE.ATTRIBUTE],
    NODE_TYPES[NODE_TYPE.SPONSOR],
    NODE_TYPES[NODE_TYPE.CUSTOM],
    NODE_TYPES[NODE_TYPE.SYSTEM],
    NODE_TYPES[NODE_TYPE.BRANCH_START],
    NODE_TYPES[NODE_TYPE.BRANCH_END]
  ],
  [CATEGORYS.DIALOG]: [NODE_TYPES[NODE_TYPE.DIALOG], NODE_TYPES[NODE_TYPE.API], NODE_TYPES[NODE_TYPE.XSLT], NODE_TYPES[NODE_TYPE.BRANCH_START], NODE_TYPES[NODE_TYPE.BRANCH_END]]
};

// React Flow Instance configuration
export const connectionLineStyle = { stroke: '#000' };
export const defaultViewport = { x: 0, y: 0, zoom: 1 };
export const snapGrid = [10, 10];
export const endMarks = {
  type: MarkerType.ArrowClosed,
  width: 20,
  height: 20,
  color: '#FF0072'
};

// Task flow designer configuration
export const TASK_NODE_TYPES = {
  START: StartNode,
  END: EndNode,
  PARTNER: TaskNode,
  APPROVAL: TaskNode,
  ATTRIBUTE: TaskNode,
  SPONSOR: TaskNode,
  CUSTOM: TaskNode,
  SYSTEM: TaskNode,
  GATEWAY: GatewayNode,
  BRANCH_START: BranchStartNode,
  BRANCH_END: BranchEndNode
};

export const TASK_EDGE_TYPES = {
  crossEdge: CrossEdge
};

export const TASK_INITIAL_NODES = [
  {
    id: 'start_1',
    type: NODE_TYPE.START,
    data: { taskName: 'Start' },
    position: { x: 250, y: 300 },
    sourcePosition: 'right'
  },
  {
    id: 'end_1',
    type: NODE_TYPE.END,
    data: { taskName: 'End' },
    position: { x: 450, y: 300 },
    targetPosition: 'left'
  }
];

// Dialog flow designer configuration
export const DIALOG_INITIAL_NODES = [
  {
    id: 'start_1',
    type: NODE_TYPE.START,
    data: { label: 'Start', taskName: 'Start' },
    position: { x: 350, y: 500 },
    sourcePosition: 'right'
  },
  {
    id: 'end_1',
    type: NODE_TYPE.END,
    data: { label: 'End', taskName: 'End' },
    position: { x: 950, y: 500 },
    targetPosition: 'left'
  }
];

export const INITIAL_EDGES = [
  {
    id: 'start_To_end',
    type: 'crossEdge',
    source: 'start_1',
    sourceHandle: 'start-node-right',
    target: 'end_1',
    targetHandle: 'end-node-left',
    data: { id: '' },
    markerEnd: {
      color: '#FF0072',
      height: 20,
      type: 'arrowclosed',
      width: 20
    }
  }
];

export const DIALOG_NODE_TYPES = {
  START: StartNode,
  END: EndNode,
  FORM: TaskNode,
  XSLT: TaskNode,
  API: TaskNode,
  GATEWAY: GatewayNode,
  BRANCH_START: BranchStartNode,
  BRANCH_END: BranchEndNode
};

export const DIALOG_EDGE_TYPES = {
  crossEdge: CrossEdge
};

// DDF Form configuration
export const COMPONENT_MAPPER = {
  [componentTypes.TEXT_FIELD]: textField,
  [componentTypes.TEXTAREA]: textarea,
  [componentTypes.SELECT]: select,
  [componentTypes.CHECKBOX]: checkbox
};

export const FORM_TEMPLATE = ({ formFields, schema }) => {
  const { handleSubmit, onCancel } = useFormApi();
  const readOnly = schema?.fields[0]?.isReadOnly;
  return (
    <form onSubmit={handleSubmit}>
      {formFields.map((formField, idx) => (
        <div key={idx} className="form-field">
          {formField}
        </div>
      ))}
      <FormSpy>
        {() => (
          <Grid fullWidth className="button-container-container">
            <Column lg={16} className="buttons-container">
              <Button kind="secondary" data-testid="cancel" name="cancel" type="button" onClick={onCancel} className="button" disabled={readOnly}>
                Cancel
              </Button>
              <Button data-testid="save" color="primary" variant="contained" type="submit" className="button" disabled={readOnly}>
                Save
              </Button>
            </Column>
          </Grid>
        )}
      </FormSpy>
    </form>
  );
};

// Query Builder Constants
export const DEFAULT_OPERATORS = [
  { name: 'equals', label: 'Equals (=)' },
  { name: 'notEquals', label: 'Not Equals (!=)' },
  { name: 'greaterThan', label: 'Greater than (>)' },
  { name: 'greaterThanEquals', label: 'Greater than or equal (>=)' },
  { name: 'lessThan', label: 'Less than (<)' },
  { name: 'lessThanEquals', label: 'Less than or equal (<=)' },
  { name: 'contains', label: '[EAP?] contains' },
  { name: 'startsWith', label: '[EAP?] begins with' },
  { name: 'endsWith', label: '[EAP?] ends with' },
  { name: 'notContains', label: '[EAP?] does not contain' },
  { name: 'notStartsWith', label: '[EAP?] does not begin with' },
  { name: 'notEndsWith', label: '[EAP?] does not end with' },
  { name: 'isNull', label: '[EAP?] is null' },
  { name: 'isNotNull', label: '[EAP?] is not null' },
  { name: 'in', label: '[EAP?] in' },
  { name: 'notIn', label: '[EAP?] not in' },
  { name: 'between', label: '[EAP?] between' },
  { name: 'notBetween', label: '[EAP?] not between' }
];

export const QUERY_FIELDS = [
  {
    name: 'string',
    label: 'String',
    operators: DEFAULT_OPERATORS.filter((op) =>
      [
        'Equals (=)',
        'Not Equals (!=)',
        // 'Greater than (>)',
        // 'Greater than or equal (>=)',
        // 'Less than (<)',
        // 'Less than or equal (<=)',
        '[EAP?] contains',
        '[EAP?] begins with',
        '[EAP?] ends with',
        '[EAP?] does not contain',
        '[EAP?] does not begin with',
        '[EAP?] does not end with',
        '[EAP?] is null',
        '[EAP?] is not null'
        // '[EAP?] in',
        // '[EAP?] not in'
      ].includes(op.label)
    )
  },
  {
    name: 'number',
    label: 'Number',
    operators: DEFAULT_OPERATORS.filter((op) =>
      [
        'Equals (=)',
        'Not Equals (!=)',
        'Greater than (>)',
        'Greater than or equal (>=)',
        'Less than (<)',
        'Less than or equal (<=)',
        // '[EAP?] in',
        // '[EAP?] not in',
        // '[EAP?] between',
        // '[EAP?] not between'
        '[EAP?] is null',
        '[EAP?] is not null'
      ].includes(op.label)
    )
  },
  {
    name: 'boolean',
    label: 'Boolean',
    operators: DEFAULT_OPERATORS.filter((op) => ['Equals (=)', 'Not Equals (!=)'].includes(op.label))
  }

  // Commenting code for date as backend is not supporting this as of now
  // {
  //   name: 'date',
  //   label: 'Date',
  //   operators: DEFAULT_OPERATORS.filter((op) =>
  //     [
  //       'Equals (=)',
  //       'Not Equals (!=)',
  //       'Greater than (>)',
  //       'Greater than or equal (>=)',
  //       'Less than (<)',
  //       'Less than or equal (<=)',
  //       '[EAP?] is null',
  //       '[EAP?] is not null',
  //       '[EAP?] between',
  //       '[EAP?] not between'
  //     ].includes(op.label)
  //   )
  // }
];

export const INITIAL_QUERY = {
  combinator: 'and',
  rules: []
};

export const QUERY_COMBINATOR = [
  { name: 'and', value: 'and', label: 'AND' },
  { name: 'or', value: 'or', label: 'OR' }
];

export const selector =
  (nodeId, isConnectable = true, maxConnections = Infinity) =>
    (s) => {
      // If the user props say this handle is not connectable, we don't need to
      // bother checking anything else.
      if (!isConnectable) return false;

      const node = s.nodeInternals.get(nodeId);
      const connectedEdges = getConnectedEdges([node], s.edges);

      return connectedEdges.length < maxConnections;
    };

export const requestMethods = [
  { id: 'select', label: '--Select--', value: '' },
  { id: 'GET', label: 'GET', value: 'GET' },
  { id: 'POST', label: 'POST', value: 'POST' },
  { id: 'PUT', label: 'PUT', value: 'PUT' },
  { id: 'DELETE', label: 'DELETE', value: 'DELETE' }
];

export const inputOutputFormats = [
  { id: 'select', label: '--Select--', value: '' },
  { id: 'xml', label: 'XML', value: 'XML' },
  { id: 'json', label: 'JSON', value: 'JSON' }
];

export const apiConfig = [
  { id: 'select', label: '--Select--', value: '' },
  { id: 'SFG_LOCAL', label: 'SFG_LOCAL', value: 'SFG_LOCAL' },
  { id: 'PEM_DEV', label: 'PEM_DEV', value: 'PEM_DEV' }
];

export const branchCondition = 'branchCondition';