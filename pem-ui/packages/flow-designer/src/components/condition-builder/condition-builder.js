//import * as ReactDnD from 'react-dnd';
//import { QueryBuilderDnD } from '@react-querybuilder/dnd';
//import * as ReactDndHtml5Backend from 'react-dnd-html5-backend';
import React from 'react';
import { Grid, Column } from '@carbon/react';
import CarbonWrapper from './condition-builder-wrapper/carbon-wrapper';
import QueryBuilder from 'react-querybuilder';
import { QUERY_COMBINATOR, QUERY_FIELDS } from '../../constants';

import './condition-builder.scss';

export default function ConditionalBuilder({ queryValidator, readOnly = { readOnly }, query, setQuery, activityDefinitionData }) {
  const validator = () => queryValidator;
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
            validator={validator}
            context={activityDefinitionData}
            showNotToggle
          />
          {/* </QueryBuilderDnD> */}
        </CarbonWrapper>
      </Column>
    </Grid>
  );
}
