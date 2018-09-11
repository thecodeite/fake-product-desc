const weightedDictionary = require('./weightedDictionary.json');

function gen() {
  const firstWord = prickWord(weightedDictionary['§start§']);
  let count = 500;
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

console.log([gen(), gen(), gen()].join(' '));
