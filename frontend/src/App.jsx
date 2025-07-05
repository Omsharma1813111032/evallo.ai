import React, { useEffect, useState } from 'react';
import FilterBar from './components/FilterBar';
import LogList from './components/LogList';
import { fetchLogs } from './services/api';
import dayjs from 'dayjs';
import styles from "./styles/app.module.css"

function App() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    message: '',
    level: '',
    resourceId: '',
    timestamp_start: null,
    timestamp_end: null
  });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const getData = async () => {
      const query = { ...filters, page, limit };

      if (filters.timestamp_start instanceof Date && !isNaN(filters.timestamp_start)) {
        query.timestamp_start = dayjs(filters.timestamp_start).toISOString();
      } else {
        delete query.timestamp_start;
      }

      if (filters.timestamp_end instanceof Date && !isNaN(filters.timestamp_end)) {
        query.timestamp_end = dayjs(filters.timestamp_end).toISOString();
      } else {
        delete query.timestamp_end;
      }

      const { logs, total } = await fetchLogs(query);
      setLogs(logs);
      setTotal(total);
    };


    getData();
  }, [filters, page]);


  const totalPages = Math.ceil(total / limit);

  return (
    <div className={styles.App}>
      <h1>Log Viewer</h1>
      <FilterBar filters={filters} onChange={(f) => { setPage(1); setFilters(f); }} />
      <LogList logs={logs} />

      <div className={styles.pagination}>
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page <= 1}
        >
          Prev
        </button>

        <span>Page {page} of {totalPages || 1}</span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page >= totalPages || totalPages === 0}
        >
          Next
        </button>

      </div>
    </div>
  );
}

export default App;
