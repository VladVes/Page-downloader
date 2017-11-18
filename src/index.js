import fs from 'mz/fs';
import { makeName, getResponse } from './common';
import { fetchResources, saveData } from './resources';

/*
eslint no-shadow: ["error", { "allow": ["data", "url", "fileName", "error"] }]
*/
/*
eslint-env es6
*/

export default (url, outputPath) => {
  const outputDir = outputPath || process.cwd();
  const resourcesDir = makeName(url, outputDir, '_files');
  const htmlFileName = makeName(url, outputDir, '.html');

  console.log('Url: ', url);
  console.log('Path: ', outputPath);
  console.log('Page will be saved to: ', outputDir);

  const response = getResponse(url);
  const data = fetchResources(response, url, resourcesDir, htmlFileName);
  return fs.mkdir(resourcesDir).then(() => saveData(data)).catch(e => e.message);
};
