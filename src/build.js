import {readFileSync, writeFileSync, mkdirSync} from 'fs';
import {sync as lsr} from 'lsr';

const filesToIgnore = [];
lsr(__dirname).filter(f => f.isFile() && /^\/\/\s*\@public/.test(readFileSync(f.fullPath, 'utf8'))).forEach(mod => {
  let id = mod.path.substr(2); // remove the `./` at the beginning of path
  if (/\/index\.js$/.test(id)) {
    id = id.replace(/\/index\.js$/, '');
  }
  if (/\.js$/.test(id)) {
    id = id.replace(/\.js$/, '');
  }
  const parts = id.split('/');
  if (parts.length === 1) {
    filesToIgnore.push('/' + id + '.js');
  } else if (filesToIgnore.indexOf('/' + parts[0]) === -1) {
    filesToIgnore.push('/' + parts[0]);
  }
  for (let i = 0; i < parts.length - 1; i++) {
    try {
      mkdirSync(__dirname + '/../' + parts.slice(0, i + 1).join('/'));
    } catch (ex) {
      if (ex.code !== 'EEXIST') throw ex;
    }
  }
  writeFileSync(__dirname + '/../' + id + '.js', `// auto-generated by ./src/build.js

module.exports = process.env.NODE_ENV === 'production' ? require('./lib/${id}') : require('./dev/${id}');`);
});

const separator = '\n# generated modules (do not edit anything after this line manually)\n';
writeFileSync(
  __dirname + '/../.gitignore',
  readFileSync(__dirname + '/../.gitignore', 'utf8').split(separator)[0] + separator +
  '\n' + filesToIgnore.sort().join('\n') + '\n'
);
