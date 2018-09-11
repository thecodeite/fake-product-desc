const fs = require('fs-extra');
(async () => {
  const { promisify } = require('util');
  const eachLine = promisify(require('line-reader').eachLine);

  const dictionary = {};

  const txt = './prod-desc.txt';
  let count = 500000;
  await eachLine(txt, { bufferSize: 10240 }, line => {
    const sentences = line
      .replace(/(href=")?https?:\/\/[\w\.-]+[^ ]+/g, 'URL')
      .toLowerCase()
      .replace(/ +/, ' ')
      .trim()
      .split('. ')
      .map(x => x.trim().replace(/[^\w ]/g, ''));

    for (let sentence of sentences) {
      const words = ['§start§', ...sentence.split(' ').filter(x => x), '§end§'];

      for (let i = 0; i < words.length - 1; i++) {
        let word = words[i];
        let next = words[i + 1];
        if (!dictionary[word]) dictionary[word] = {};
        if (!dictionary[word][next]) dictionary[word][next] = 1;
        else dictionary[word][next]++;
      }
    }

    return count-- > 0;
  });

  const weightedDictionary = calc(dictionary);
  await fs.writeFile(
    './weightedDictionary.json',
    JSON.stringify(weightedDictionary, null, '  ')
  );
})();

function calc(dictionary) {
  return Object.entries(dictionary).reduce((p, [k, v]) => {
    const total = Object.values(v).reduce((p, c) => p + c, 0);
    return {
      ...p,
      [k]: Object.entries(v)
        .map(([kk, vv]) => ({
          word: kk,
          abs: vv,
          rel: vv / total
        }))
        .sort((a, b) => (a.rel === b.rel ? 0 : a.rel > b.rel ? -1 : 1))
    };
  }, {});
}

function gen(weightedDictionary) {
  const firstWord = prickWord(weightedDictionary['§start§']);
  let count = 50;
  let nextWord = firstWord;
  let sentence = firstWord[0].toUpperCase() + firstWord.slice(1);
  do {
    let nextWordArr = weightedDictionary[nextWord];
    if (Array.isArray(nextWordArr) && nextWordArr.length) {
      nextWord = prickWord(nextWordArr);
      if (nextWord === '§end§') {
        sentence += '.';
      } else {
        sentence += ' ' + nextWord;
      }
    }
  } while (count-- > 0 && nextWord && nextWord !== '§end§');
  return sentence;
}

function prickWord(arr) {
  const r = Math.random();
  let acc = 0;
  let index = 0;
  let cur;
  while (acc < r) {
    cur = arr[index++];
    acc += cur.rel;
  }

  return cur.word;
}
