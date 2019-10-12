import React, { memo } from 'react';

const SelectRegions = memo((props) => {
  const {
    regions,
    isLoading, 
    selectedRegion,
    onRegionChange,
  } = props;

  return (
    <select 
      name='regions' 
      disabled={isLoading}
      value={selectedRegion} 
      onChange={onRegionChange}
    >
      <option key='default' value=''>Select region</option>
      {regions.map((region) => {
        return (
          <option key={region} value={region}>
            {region}
          </option>
        )
      })}
    </select>
  );
});

export default SelectRegions;
