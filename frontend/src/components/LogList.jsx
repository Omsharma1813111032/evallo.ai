import React from 'react';
import dayjs from 'dayjs';
import styles from "../styles/app.module.css";

const levelColors = {
    error: '#ffe6e6',
    warn: '#fffbe6',
    info: '#e6f7ff',
    debug: '#f5f5f5'
};

const LogList = ({ logs }) => {
    if (!logs.length) {
        return <div className={styles.noLogs}>No logs found.</div>;
    }

    return (
        <div className={styles.logList}>
            {logs.map((log, index) => (
                <div
                    key={index}
                    className={styles.logItem}
                    style={{ borderLeft: `5px solid ${levelColors[log.level] || '#ccc'}` }}
                >
                    <div className={styles.logHeader}>
                        <span className={styles.levelTag}>{log.level.toUpperCase()}</span>
                        <span className={styles.timestamp}>
                            {dayjs(log.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                        </span>
                    </div>
                    <div className={styles.logMessage}>{log.message}</div>
                    <div className={styles.logMeta}>
                        <span><strong>Resource:</strong> <code>{log.resourceId}</code></span>
                        <span><strong>Trace ID:</strong> <code>{log.traceId}</code></span>
                        <span><strong>Span ID:</strong> <code>{log.spanId}</code></span>
                        <span><strong>Commit:</strong> <code>{log.commit}</code></span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LogList;
