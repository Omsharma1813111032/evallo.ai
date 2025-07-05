const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../logs.json');

function readLogs() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
}

function writeLogs(logs) {
  fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));
}

module.exports = {
  readLogs,
  writeLogs
};
