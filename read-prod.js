(async () => {
  const lineReader = require('line-reader');

  const csv = './johnlewis_product_catalogue_15a_20180709.csv';
  // const csv = './head.csv';
  let headers = null;
  let index = 1;
  await lineReader.eachLine(csv, { bufferSize: 10240 }, (line, last) => {
    if (!headers) {
      headers = line;
      return true;
    } else {
      console.log(readCsvLine(line)[3]);
      return !last;
    }
  });
})();

function readCsvLine(line) {
  let i = 0,
    len = line.length;
  const read = () => line[i++];
  const p = () => line[i];
  const nf = () => i < len;
  const assert = x => {
    if (line[i++] !== x) throw new Error(`${line[i - 1]} !== ${x}`);
  };
  const parts = [];

  while (nf()) {
    if (p() !== '"') {
      let notWrapped = '';
      while (nf() && p() !== ',') {
        notWrapped += read();
      }
      parts.push(notWrapped);
    } else {
      let wrapped = '';
      assert('"');
      while (nf()) {
        if (p() === '"') {
          assert('"');
          if (p() !== '"') break;
        }
        wrapped += read();
      }

      parts.push(wrapped);
    }

    if (p() === ',') {
      assert(',');
      if (!nf()) {
        parts.push('');
      }
    }
  }

  return parts;
}
