import fs from 'mz/fs';
import { makeName, getResponse, writeToFile } from './common';
import { fetchResources } from './resources';

/*
eslint no-shadow: ["error", { "allow": ["data", "url", "fileName", "error"] }]
*/
/*
eslint-env es6
*/

export default (url, outputDir) => {
  const resourcesDir = makeName(url, outputDir, '_files');
  const htmlFileName = makeName(url, outputDir, '.html');

  console.log('Url: ', url);
  console.log('Page will be saved to: ', outputDir);

  return fs.mkdir(resourcesDir)
    .then(() => getResponse(url))
    .then(htmlPage => fetchResources(htmlPage, url, resourcesDir, htmlFileName))
    .then(dataColl => Promise.all(dataColl.map(el => writeToFile(el.data, el.location, el.type))))
    .catch(err => console.log(err.message));
};
