const { createObjectCsvStringifier } = require('csv-writer');

function generateCSV(data, columns) {
  const csvStringifier = createObjectCsvStringifier({
    header: columns.map((col) => ({
      id: col.id,
      title: col.title,
    })),
  });

  const header = csvStringifier.getHeaderString();
  const body = csvStringifier.stringifyRecords(data);

  return Buffer.from(header + body, 'utf-8');
}

module.exports = { generateCSV };
