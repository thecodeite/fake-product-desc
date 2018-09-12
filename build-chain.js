const JS = require('./JS');

const fs = require('fs-extra');
(async () => {
  const { promisify } = require('util');
  const eachLine = promisify(require('line-reader').eachLine);

  let idCount = 1;
  const words = {};
  const links = {};

  const txt = './prod-desc.txt';
  let count = 1000000;
  await eachLine(txt, { bufferSize: 10240 }, line => {
    // console.log('line:', line);
    const sentences = line
      .replace(/(href=")?https?:\/\/[\w\.-]+[^ ]+/g, 'URL')
      .toLowerCase()
      .replace(/ +/, ' ')
      .trim()
      .split('. ')
      .map(x => x.replace(/\./g, '').trim());

    for (let sentence of sentences) {
      const sentenceWords = ['§s', ...sentence.split(' ').filter(x => x), '§e'];

      for (let i = 0; i < sentenceWords.length; i++) {
        let word = sentenceWords[i];
        let next = sentenceWords[i + 1];
        let prev = sentenceWords[i - 1];
        let wordId, nextId, prevId;

        wordId = words[word] = words[word] || idCount++;
        if (next) nextId = words[next] = words[next] || idCount++;
        if (prev) prevId = words[prev] = words[prev] || idCount++;

        if (!links[wordId]) links[wordId] = { w: word, c: 1 };
        else links[wordId].c++;

        if (next) {
          if (!links[wordId].n) links[wordId].n = { f: {}, t: 0 };
          if (!links[wordId].n.f[nextId]) links[wordId].n.f[nextId] = 1;
          else links[wordId].n.f[nextId]++;
          links[wordId].n.t++;
        }
        if (prev) {
          if (!links[wordId].p) links[wordId].p = { f: {}, t: 0 };
          if (!links[wordId].p.f[prevId]) links[wordId].p.f[prevId] = 1;
          else links[wordId].p.f[prevId]++;
          links[wordId].p.t++;
        }
      }
    }

    return count-- > 0;
  });

  await fs.writeFile(
    './weightedLinks.js',
    JS.stringify(links, depth => (/^(o|a)?$/.test(depth) ? '  ' : ''))
  );
  await fs.writeFile('./weightedLinks.json', JSON.stringify(links, null, '  '));
})();
