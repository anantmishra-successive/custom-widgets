import React from 'react';
import { CalciteSelect, CalciteOption } from 'calcite-components';

const MyMultiSelectWidget = () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const handleSelectionChange = (event) => {
    const selectedOptions = event.target.selectedOptions;
    const selectedValues = Array.from(selectedOptions).map(option => option.value);
    console.log('Selected values:', selectedValues);
    // Implement logic to use the selected values, e.g., filter a map layer
  };

  return (
    <div className="my-multiselect-widget">
      <label htmlFor="my-multiselect">Select Items:</label>
      <CalciteSelect id="my-multiselect" multiple onChange={handleSelectionChange}>
        {options.map(option => (
          <CalciteOption key={option.value} value={option.value}>
            {option.label}
          </CalciteOption>
        ))}
      </CalciteSelect>
    </div>
  );
};

export default MyMultiSelectWidget;