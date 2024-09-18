import React, { useEffect, useState } from 'react';
import { Column, Select, SelectItem } from '@carbon/react';

export default function ActivityVersions({ versionData = [], selectedVersion, onVersionSelection }) {
  const [currentValue, setCurrentValue] = useState();

  useEffect(() => {
    const currentSelectedvalue = versionData.find((x) => x.version === selectedVersion);
    if (currentSelectedvalue) {
      setCurrentValue(currentSelectedvalue);
    }
  }, []);
  return (
    <Column lg={3} md={3} sm={2} id="versionData">
      <Select
        hideLabel={true}
        id={'activity-version'}
        key={'vresiondd'}
        value={currentValue?.activityDefnVersionKey}
        onChange={(event) => {
          setCurrentValue(versionData.find((x) => x.activityDefnVersionKey === event.target.value));
          if (onVersionSelection) {
            onVersionSelection(versionData.find((x) => x.activityDefnVersionKey === event.target.value));
          }
        }}
      >
        {versionData.map((item) => {
          return <SelectItem key={item.version} value={item.activityDefnVersionKey} text={`Ver ${item.version}`}></SelectItem>;
        })}
      </Select>
    </Column>
  );
}
