import React, { useEffect, useState } from 'react';
import ConditionalBuilder from '../condition-builder';
import { Select, SelectItem, Grid, Column } from '@carbon/react';
import useTaskStore from '../../store';
import { INITIAL_QUERY, NODE_TYPE } from '../../constants';

export default function GatewayValidation({ readOnly, selectedNode, selectedTaskNode }) {
  const storeData = useTaskStore((state) => state.tasks);
  const [connectedGatewayNodes, setConnectedGatewayNodes] = useState([]);
  const [selectedGatewayNode, setSelectedGatewayNode] = useState();
  const editTask = useTaskStore((state) => state.editTaskNodePros);
  const editDialog = useTaskStore((state) => state.editDialogNodePros);

  const [query, setQuery] = useState(INITIAL_QUERY);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (storeData && storeData.edges.length > 0 && storeData.nodes.length > 0) {
      const connectedEdges = storeData.edges.filter((edge) => edge.source === selectedNode.id);
      const connectedNodes = getConnectedNodes(storeData.nodes, connectedEdges);
      setConnectedGatewayNodes(connectedNodes);
      setSelectedGatewayNode(connectedNodes.length > 0 && connectedNodes[0].id);
    }
  }, [storeData]);

  const getConnectedNodes = (storeNodes, connectedEdges) => {
    return storeNodes.filter((o1) => {
      return connectedEdges.some((o2) => o2.target === o1.id);
    });
  };

  const onGatewayValidationSubmit = (modifiedQuery, errorMessage) => {
    const chooseGatewayNode = storeData.nodes.filter((node) => node.id === selectedGatewayNode);
    if (chooseGatewayNode.length > 0) {
      if (chooseGatewayNode[0].type === NODE_TYPE.API || chooseGatewayNode[0].type === NODE_TYPE.DIALOG || chooseGatewayNode[0].type === NODE_TYPE.XSLT) {
        editDialog(chooseGatewayNode[0], selectedTaskNode, 'entryValidationQuery', query);
        editDialog(chooseGatewayNode[0], selectedTaskNode, 'validateEntryValidationQuery', modifiedQuery);
        editDialog(chooseGatewayNode[0], selectedTaskNode, 'entryValidationMessage', errorMessage);
      } else {
        editTask(chooseGatewayNode[0], 'entryValidationQuery', query);
        editTask(chooseGatewayNode[0], 'validateEntryValidationQuery', modifiedQuery);
        editDialog(chooseGatewayNode[0], 'entryValidationMessage', errorMessage);
      }
    }
  };

  function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
  }

  return (
    <>
      <Grid>
        <Column className="form-field" lg={8}>
          <Select
            id="connectedNodes-selector"
            data-testid="connectedNodes-selector"
            labelText={`Select ${capitalize(selectedNode.data?.category)}`}
            onChange={(event) => setSelectedGatewayNode(event.target.value)}
          >
            {connectedGatewayNodes?.map((connectedGatewayNode) => (
              <SelectItem
                key={connectedGatewayNode.id}
                text={
                  connectedGatewayNode.data.editableProps && connectedGatewayNode.data.editableProps.name ? connectedGatewayNode.data.editableProps.name : connectedGatewayNode.id
                }
                value={connectedGatewayNode.id}
                data-testid={connectedGatewayNode.id}
              />
            ))}
          </Select>
        </Column>
      </Grid>
      <ConditionalBuilder
        setOpenCancelDialog={() => console.log('Cancel')}
        onSubmitExitValidationForm={onGatewayValidationSubmit}
        readOnly={readOnly}
        query={query}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        setQuery={setQuery}
      />
    </>
  );
}
