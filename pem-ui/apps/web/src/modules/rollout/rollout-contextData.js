
import React from 'react';
import ContextDataModal from './contextData/CDM-page';

const RolloutContextData = (contextData) => {

    const jsonData = JSON.parse(contextData.page.form.rollout.watch('rolloutContextData'))

    return (
        <>
            <ContextDataModal contextData={jsonData} contextPage={contextData} />
        </>
    );
};

export default RolloutContextData;