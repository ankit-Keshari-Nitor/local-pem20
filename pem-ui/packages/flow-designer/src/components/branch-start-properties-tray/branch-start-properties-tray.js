import React, { useEffect, useState } from 'react';
import { Grid, Column, TextInput, Button } from '@carbon/react';
import useTaskStore from '../../store';
import './branch-start-properties-tray.scss';
import { TrashCan } from '@carbon/icons-react';
import { HamburgerIcon, DragIcon } from '../../icons';
import ConditionalBuilder from '../condition-builder/branch-conditional-builder';
import { branchCondition } from '../../constants';

import { useDrag, useDrop } from 'react-dnd';

const ItemTypes = {
  CONNECTOR: 'connector'
};

// Draggable Item Component
const DraggableConnectorItem = ({ connector, index, moveDialogItem }) => {
  const [, ref] = useDrag({
    type: ItemTypes.CONNECTOR,
    item: { id: connector.connectorId, index }
  });

  return (
    <div ref={ref} className="draggable-item">
      <DragIcon />
    </div>
  );
};

// Drop Target Component
const DropConnector = ({ children, index, moveDialogItem }) => {
  const [, ref] = useDrop({
    accept: ItemTypes.CONNECTOR,
    hover: (item) => {
      moveDialogItem(item.index, index);
      item.index = index;
    }
  });

  return (
    <div ref={ref} className="drop-target">
      {children}
    </div>
  );
};

export default function BranchStartPropertiesTrayTwo({
  readOnly,
  selectedNode,
  selectedTaskNode,
  isDialogFlowActive,
  deleteBranchNodeConnector,
  setOpenPropertiesBlock,
  deleteNode,
  branchStart
}) {
  const store = useTaskStore();
  const storeData = useTaskStore((state) => state.tasks);
  const editTask = useTaskStore((state) => state.editTaskNodePros);
  const editDialog = useTaskStore((state) => state.editDialogNodePros);

  const [branchName, setBranchName] = useState('');
  const [branchNameError, setBranchNameError] = useState(false);
  const [selectedBranchConnector, setSelectedBranchConnector] = useState([]);
  const [showDialogSequence, setShowDialogSequence] = useState(false);
  useEffect(() => {
    setBranchName(selectedNode?.data?.editableProps.name ? selectedNode?.data?.editableProps.name : selectedNode?.data.id);
  }, [storeData]);

  useEffect(() => {
    if (branchStart) {
      let updatedBranchConditions = selectedNode?.data.branchCondition.map((condition) => {
        let targetNode = null;
        if (isDialogFlowActive) {
          storeData.nodes.map((node) => {
            if (node.id === selectedTaskNode.id) {
              const {
                data: { dialogNodes }
              } = node;
              targetNode = dialogNodes.filter((node) => node.id === condition.target);
            }
          });
        } else {
          targetNode = storeData.nodes.filter((node) => node.id === condition.target);
        }
        return {
          ...condition,
          targetNodeName: targetNode && targetNode[0].data?.editableProps?.name ? targetNode[0]?.data.editableProps?.name : targetNode[0]?.data.id
        };
      });

      setSelectedBranchConnector(updatedBranchConditions);
    }
  }, [storeData]);

  // Function to update the branch name
  const handleBranchNameChange = (e) => {
    setBranchName(e.target.value);
    if (e.target.value === '') {
      setBranchNameError(true);
    } else {
      setBranchNameError(false);
    }
  };

  // Function to show/hide the dialog sequence
  const handleHamburgerClick = () => {
    setShowDialogSequence((pre) => !pre);
  };

  // Function to update the connector query
  const updateConnectorQuery = (updatedQuery, targetId) => {
    if (isDialogFlowActive) {
      store.updateDialogBranchConnector(selectedNode, selectedTaskNode, updatedQuery, targetId, branchCondition);
    } else {
      store.updateTaskBranchConnector(selectedNode, updatedQuery, targetId, branchCondition);
    }
  };

  // Function to delete connector
  const deleteConnector = (connectorId) => {
    if (!readOnly) {
      deleteBranchNodeConnector(selectedNode, selectedTaskNode, connectorId, branchCondition);
    }
  };

  const handleNodeNameChange = (e, targetId) => {
    if (isDialogFlowActive) {
      store.updateDialogNodeName(targetId, selectedTaskNode, 'editableProps', { name: e.target.value });
    } else {
      store.updateTaskNodeName(targetId, 'editableProps', { name: e.target.value });
    }
  };

  const saveBranchData = () => {
    if (branchName === '') {
      setBranchNameError(true);
      return;
    }
    if (selectedTaskNode) {
      editDialog(selectedNode, selectedTaskNode, 'editableProps', { name: branchName });
    } else {
      editTask(selectedNode, 'editableProps', { name: branchName });
    }
    setOpenPropertiesBlock(false);
  };

  const moveDialogItem = (fromIndex, toIndex) => {
    const updatedBranchConnectors = [...selectedBranchConnector];
    const [movedItem] = updatedBranchConnectors.splice(fromIndex, 1);
    updatedBranchConnectors.splice(toIndex, 0, movedItem);
    setSelectedBranchConnector(updatedBranchConnectors);

    //Update Store
    if (isDialogFlowActive) {
      store.updateDialogBranchConnectorSequence(selectedNode, selectedTaskNode, updatedBranchConnectors, branchCondition);
    } else {
      store.updateTaskBranchConnectorSequence(selectedNode, updatedBranchConnectors, branchCondition);
    }
  };

  return (
    <>
      {/* Name input */}
      <Grid>
        <Column lg={8} className="branch-input-container">
          <TextInput
            id="branch-name"
            type="text"
            labelText="Branch Name (required)"
            value={branchName}
            disabled={readOnly}
            onChange={handleBranchNameChange}
            invalid={branchNameError}
            invalidText="Branch Name is required"
          />
        </Column>
        <Column className='branch-delete' lg={8}>
          <span
            onClick={() => {
              deleteNode(selectedNode.id, isDialogFlowActive, selectedTaskNode?.id, true);
            }}
          >
            <TrashCan />
          </span>
        </Column>
      </Grid>
      {/* Conditional Builder and Dialog Sequence */}
      {branchStart && (
        <>
          <Grid className="properties-container">
            {selectedBranchConnector && selectedBranchConnector.length > 0 ? (
              <>
                <Column lg={16} className="hamburger-container">
                  <span className="hamburger-icon" onClick={handleHamburgerClick}>
                    <HamburgerIcon />
                  </span>
                </Column>
                {/* Add Conditional Builder to each node container */}
                <Column lg={showDialogSequence ? 11 : 16} className="dialog-properties-container">
                  {selectedBranchConnector.map((connector) => {
                    return (
                      <div id={connector.connectorId}>
                        <Grid>
                          <Column lg={16}>
                            <span className="pem-node-name">{connector.targetNodeName}</span>
                          </Column>
                          <Column lg={16}>
                            <ConditionalBuilder readOnly={readOnly} query={connector.condition} updateConnectorQuery={updateConnectorQuery} id={connector.target} />
                          </Column>
                        </Grid>
                      </div>
                    );
                  })}
                </Column>
                {/* Dialog Sequence */}
                {showDialogSequence && (
                  <Column lg={5} className="dialog-properties-container">
                    <div className="dialog-sequence-wrapper">
                      <Grid>
                        <Column lg={16}>
                          <span className="pem-node-name">Dialog Sequence</span>
                          {selectedBranchConnector.map((connector, index) => (
                            <DropConnector index={index} moveDialogItem={moveDialogItem} key={connector.connectorId}>
                              <Grid className="dialog-sequence-container" id={connector.target}>
                                <Column lg={3}>
                                  <DraggableConnectorItem connector={connector} index={index} moveDialogItem={moveDialogItem} />
                                </Column>
                                <Column lg={10} className="text-input-container">
                                  <TextInput
                                    id={`text-value-${connector.target}`}
                                    disabled
                                    value={connector.targetNodeName}
                                    onChange={(e) => handleNodeNameChange(e, connector.target)}
                                    className="draggable-input"
                                  />
                                </Column>
                                {!readOnly && (
                                  <Column lg={3} className="delete-icon-container" onClick={() => deleteConnector(connector.connectorId)}>
                                    <TrashCan className="trash-icon" />
                                  </Column>
                                )}
                              </Grid>
                            </DropConnector>
                          ))}
                        </Column>
                      </Grid>
                    </div>
                  </Column>
                )}
              </>
            ) : (
              <Column lg={16} className="no-connector-container">
                <span>No connector found!!</span>
              </Column>
            )}
          </Grid>
          <Grid className="button-container-container">
            <Column lg={16} className="buttons-container">
              <Button data-testid="cancel" name="cancel" kind="secondary" type="button" className="button" onClick={saveBranchData} disabled={readOnly}>
                Cancel
              </Button>
              <Button data-testid="save" color="primary" variant="contained" type="submit" className="button" onClick={saveBranchData} disabled={readOnly}>
                Save
              </Button>
            </Column>
          </Grid>
        </>
      )}
    </>
  );
}
