import { makeName, getResponse, writeToFile } from './common';
import {fetchResources} from './resources';

/*
eslint no-shadow: ["error", { "allow": ["data", "url", "fileName", "error"] }]
*/
/*
eslint-env es6
*/

export default (url, outputPath) => {
  const outputDir = outputPath || process.cwd();
  const fileName = makeName(url, outputDir, '.html');
  const resDirName = makeName(url, outputDir, '_files');

  console.log('Url: ', url);
  console.log('Path: ', outputDir);
  console.log('Page will be saved as: ', fileName);

  const response = getResponse(url);
  const links = fetchResources(response, url, resDirName);
  //const newHtml = convertLinksToLocal(links, response);

  return writeToFile(response, fileName);
};
