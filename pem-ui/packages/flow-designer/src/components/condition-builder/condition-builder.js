import React from 'react';
//import * as ReactDnD from 'react-dnd';
import { TextArea, Grid, Column, Button } from '@carbon/react';
//import { QueryBuilderDnD } from '@react-querybuilder/dnd';
//import * as ReactDndHtml5Backend from 'react-dnd-html5-backend';
import CarbonWrapper from './condition-builder-wrapper/carbon-wrapper';
import QueryBuilder from 'react-querybuilder';
//import { validationQuery } from '../helpers/generate-validation-query';
import { QUERY_COMBINATOR, QUERY_FIELDS } from '../../constants';

import './condition-builder.scss';

export default function ConditionalBuilder({ onSubmitExitValidationForm, setOpenCancelDialog, readOnly = { readOnly }, query, errorMessage, setErrorMessage, setQuery }) {
  return (
    <Grid>
      <Column className="form-field" lg={16}>
        <CarbonWrapper>
          {/* <QueryBuilderDnD dnd={{ ...ReactDnD, ...ReactDndHtml5Backend }}> */}
            <QueryBuilder
              fields={QUERY_FIELDS}
              query={query}
              onQueryChange={setQuery}
              combinators={QUERY_COMBINATOR}
              controlClassnames={{ queryBuilder: 'queryBuilder-branches', body: 'inline-indycomb-left' }}
              disabled={readOnly}
            />
          {/* </QueryBuilderDnD> */}
        </CarbonWrapper>
      </Column>
      {/* <Column className="form-field" lg={16}>
        <TextArea placeholder="Enter Text" labelText="Error Message" rows={4} id="text-area-1" disabled={readOnly} onChange={(e) => setErrorMessage(e.target.value)}  value={errorMessage}/>
      </Column> */}
      {/* <Column className="form-field" lg={16}>
          <h4>Query</h4>
          <pre>
            <code>{formatQuery(validationQuery(query), 'json')}</code>
          </pre>
        </Column> */}
      <Grid fullWidth className="button-container-container">
        <Column lg={16} className="buttons-container">
          <Button data-testid="cancel" name="cancel" kind="secondary" type="button" className="button" onClick={setOpenCancelDialog} disabled={readOnly}>
            Cancel
          </Button>
          <Button
            data-testid="save"
            color="primary"
            variant="contained"
            type="submit"
            style={{ width: '100%' }}
            onClick={() => onSubmitExitValidationForm(query, errorMessage)}
            disabled={readOnly}
          >
            Save
          </Button>
        </Column>
      </Grid>
    </Grid>
  );
}

 