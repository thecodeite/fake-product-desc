const http = require('http');
const { generateRooted, generateRandom } = require('./build-text');
console.log('Load started');
const links = Object.values(require('./weightedLinks.js'));
console.log('Load finished');

const service = http.createServer((req, res) => {
  const url = require('url').parse(req.url);
  console.log(req.method, url.path);
  let query = {};

  if (url.pathname === '/favicon.ico') {
    res.writeHead(302, {
      Location:
        'https://www.johnlewis.com/assets/36076bc/favicons/android-icon-b-192x192.png'
    });
    res.end();
    return;
  }

  console.log('url.search:', url.search);
  if (url.search) {
    const search = url.search.substr(1);
    query = search
      .split('&')
      .map(x => x.split('='))
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
  }

  const seed = query.seed || Math.floor(Math.random() * 100000);
  if (url.pathname.startsWith('/contains/')) {
    const root = url.pathname.substr('/contains/'.length);
    res.end(
      JSON.stringify(
        {
          description: generateRooted(root, seed),
          root,
          seed
        },
        null,
        '  '
      )
    );
  } else if (url.pathname.startsWith('/starts/')) {
    const prefix = url.pathname.substr('/starts/'.length);
    const matches = links
      .filter(x => x.w.startsWith(prefix))
      .map(x => ({ w: x.w, c: x.c }))
      .sort((a, b) => (a.c === b.c ? 0 : a.c > b.c ? -1 : 1));
    res.end(JSON.stringify(matches, null, '  '));
  } else {
    res.end(
      JSON.stringify(
        {
          description: generateRandom(seed),
          seed
        },
        null,
        '  '
      )
    );
  }
});

service.listen(12014, err => {
  if (err) console.error(`Error listening on port 12014 ${e}`);
  console.log('Listening on port 12014');
});
