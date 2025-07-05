import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from "../styles/app.module.css";

const levelOptions = [
  { value: 'error', label: 'Error' },
  { value: 'warn', label: 'Warn' },
  { value: 'info', label: 'Info' },
  { value: 'debug', label: 'Debug' }
];

const FilterBar = ({ filters, onChange }) => {
  const [searchText, setSearchText] = useState(filters.message || '');

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange({ ...filters, message: searchText });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchText]);

  const handleSelectChange = (selected) => {
    const levels = selected.map(opt => opt.value);
    onChange({ ...filters, level: levels.join(',') });
  };

  return (
    <div className={styles.filter_Bar}>
      <input
        type="text"
        placeholder="Search message..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <Select
        isMulti
        options={levelOptions}
        className="select"
        placeholder="Log Levels"
        onChange={handleSelectChange}
      />
      <input
        type="text"
        placeholder="Resource ID"
        value={filters.resourceId}
        onChange={(e) => onChange({ ...filters, resourceId: e.target.value })}
      />
      <DatePicker
        selected={filters.timestamp_start}
        onChange={(date) => onChange({ ...filters, timestamp_start: date })}
        placeholderText="Start Date"
        showTimeSelect
        dateFormat="Pp"
      />
      <DatePicker
        selected={filters.timestamp_end}
        onChange={(date) => onChange({ ...filters, timestamp_end: date })}
        placeholderText="End Date"
        showTimeSelect
        dateFormat="Pp"
      />
    </div>
  );
};

export default FilterBar;
