console.log('Load started');
const links = require('./weightedLinks.js');
console.log('Load finished');
const random = require('./random.js');

const words = Object.entries(links).reduce((acc, [k, v]) => {
  acc[v.w] = parseInt(k, 10);
  return acc;
}, {});
const reverseWords = Object.entries(links).reduce((acc, [k, v]) => {
  acc[k] = v.w;
  return acc;
}, {});

const startWordId = words['§s'];
const endWordId = words['§e'];

function followChain(rootWordId = startWordId, selector = x => x.n, seed) {
  console.log('{rootWordId, selector, seed}:', { rootWordId, selector, seed });
  const nextRand = random(seed);
  let count = 500;
  let nextWordId = rootWordId;
  const sentence = [];
  do {
    let next = links[nextWordId];
    if (!next) throw new Error('nextWordId:' + nextWordId);
    let nextWordObj = selector(next);
    if (nextWordObj && Object.keys(nextWordObj.f).length) {
      nextWordId = pickWord(nextWordObj, nextRand);
      if (nextWordId !== endWordId && nextWordId !== startWordId) {
        sentence.push(nextWordId);
      }
    }
  } while (
    count-- > 0 &&
    nextWordId &&
    nextWordId !== endWordId &&
    nextWordId !== startWordId
  );
  return sentence;
}

function generateRooted(rootWord, seed) {
  if (!rootWord) {
    console.log('rootWord is missing.');
    return 'rootWord is missing.';
  }

  if (!words[rootWord]) {
    console.log(rootWord, 'is not in any descriptions.');
    return `"${rootWord}" is not in any descriptions.`;
  }

  const root = words[rootWord];

  const forward = followChain(root, x => x.n, seed);
  const backwards = followChain(root, x => x.p, seed);
  return toSentence([...backwards.reverse(), root, ...forward]);
}

function generateRandom(seed) {
  return toSentence(followChain(undefined, undefined, seed));
}

function pickWord(obj, nextRand) {
  const r = nextRand() * obj.t;
  let acc = 0;
  let index = 0;
  let cur;
  const arr = Object.entries(obj.f).map(([word, weight]) => ({
    word: parseInt(word, 10),
    weight
  }));
  try {
    do {
      cur = arr[index];
      index++;
      acc += cur.weight;
    } while (cur && acc < r);

    if (!cur) {
      throw new Error('MISSING');
    }

    return cur.word;
  } catch (e) {
    console.log('e:', e);
    console.log('cur:', cur);
    console.log('arr:', arr);
    console.log('obj:', obj);
    console.log('acc:', acc);
  }
}

function toSentence(arr) {
  const raw = arr.map(id => reverseWords[id]).join(' ');
  return raw[0].toUpperCase() + raw.slice(1) + '.';
}

// console.log([gen('perfect')].join(' '));
// console.log(genRandom());

// console.log('process.argv[2]:', process.argv[2]);

module.exports = {
  generateRooted,
  generateRandom
};
