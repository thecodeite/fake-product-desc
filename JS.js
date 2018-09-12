const stringify = (target, indentF) => {
  const indent = typeof indentF === 'string' ? () => indentF : indentF;

  const str = (x, ind, depth) => {
    if (Array.isArray(x)) {
      const d = depth + 'a';
      return (
        '[' +
        (indent(d) ? '\n' + ind : '') +
        x
          .map(v => str(v, indent(d) && ind + indent(d), d))
          .join(indent(d) ? ',\n' + ind : ',') +
        (indent(d) ? '\n' + ind : '') +
        ']'
      );
    }
    if (x === null) return null;
    if (x === undefined) return undefined;

    if (typeof x === 'object') {
      const d = depth + 'o';
      return (
        '{' +
        (indent(d) ? '\n' + ind : '') +
        Object.entries(x)
          .map(
            ([k, v]) =>
              `${asKey(k)}${indent(d) ? ': ' : ':'}${str(
                v,
                indent && ind + indent(d),
                d
              )}`
          )
          .join(indent(d) ? ',\n' + ind : ',') +
        (indent(d) ? '\n' + ind : '') +
        '}'
      );
    }
    return JSON.stringify(x);
  };

  return `module.exports=${str(target, indent(''), '')}`;
};

const asKey = k => {
  if (
    /^([a-zA-Z_$][0-9a-zA-Z_$]*|[0-9]+)$/.test(k) &&
    !reservedWords.includes(k)
  ) {
    return k;
  } else {
    return JSON.stringify(k);
  }
};

module.exports = { stringify };

const reservedWords = [
  'abstract',
  'else',
  'instanceof',
  'super',
  'boolean',
  'enum',
  'int',
  'switch',
  'break',
  'export',
  'interface',
  'synchronized',
  'byte',
  'extends',
  'let',
  'this',
  'case',
  'false',
  'long',
  'throw',
  'catch',
  'final',
  'native',
  'throws',
  'char',
  'finally',
  'new',
  'transient',
  'class',
  'float',
  'null',
  'true',
  'const',
  'for',
  'package',
  'try',
  'continue',
  'function',
  'private',
  'typeof',
  'debugger',
  'goto',
  'protected',
  'var',
  'default',
  'if',
  'public',
  'void',
  'delete',
  'implements',
  'return',
  'volatile',
  'do',
  'import',
  'short',
  'while',
  'double',
  'in',
  'static',
  'with',
  'alert',
  'frames',
  'outerHeight',
  'all',
  'frameRate',
  'outerWidth',
  'anchor',
  'function',
  'packages',
  'anchors',
  'getClass',
  'pageXOffset',
  'area',
  'hasOwnProperty',
  'pageYOffset',
  'Array',
  'hidden',
  'parent',
  'assign',
  'history',
  'parseFloat',
  'blur',
  'image',
  'parseInt',
  'button',
  'images',
  'password',
  'checkbox',
  'Infinity',
  'pkcs11',
  'clearInterval',
  'isFinite',
  'plugin',
  'clearTimeout',
  'isNaN',
  'prompt',
  'clientInformation',
  'isPrototypeOf',
  'propertyIsEnum',
  'close',
  'java',
  'prototype',
  'closed',
  'JavaArray',
  'radio',
  'confirm',
  'JavaClass',
  'reset',
  'constructor',
  'JavaObject',
  'screenX',
  'crypto',
  'JavaPackage',
  'screenY',
  'Date',
  'innerHeight',
  'scroll',
  'decodeURI',
  'innerWidth',
  'secure',
  'decodeURIComponent',
  'layer',
  'select',
  'defaultStatus',
  'layers',
  'self',
  'document',
  'length',
  'setInterval',
  'element',
  'link',
  'setTimeout',
  'elements',
  'location',
  'status',
  'embed',
  'Math',
  'String',
  'embeds',
  'mimeTypes',
  'submit',
  'encodeURI',
  'name',
  'taint',
  'encodeURIComponent',
  'NaN',
  'text',
  'escape',
  'navigate',
  'textarea',
  'eval',
  'navigator',
  'top',
  'event',
  'Number',
  'toString',
  'fileUpload',
  'Object',
  'undefined',
  'focus',
  'offscreenBuffering',
  'unescape',
  'form',
  'open',
  'untaint',
  'forms',
  'opener',
  'valueOf',
  'frame',
  'option',
  'window',
  'onbeforeunload',
  'ondragdrop',
  'onkeyup',
  'onmouseover',
  'onblur',
  'onerror',
  'onload',
  'onmouseup',
  'ondragdrop',
  'onfocus',
  'onmousedown',
  'onreset',
  'onclick',
  'onkeydown',
  'onmousemove',
  'onsubmit',
  'oncontextmenu',
  'onkeypress',
  'onmouseout',
  'onunload'
];
