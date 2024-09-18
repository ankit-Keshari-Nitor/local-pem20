import React from 'react';
import './top-nav.scss';
import { Button } from '@carbon/react';

const TopNav = ({ setSowSchema, showSchema }) => {
  return (
    <div className="top-nav-container">
      <div className="heading-container">
        <span className="heading-text">Precisely Forms Editor</span>
      </div>
      <div className="buttons-container"></div>
      <div className="schema-button-container">
        <Button kind="secondary" onClick={() => setSowSchema(!showSchema)}>
          Show Schema
        </Button>
      </div>
    </div>
  );
};

export default TopNav;
