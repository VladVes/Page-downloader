import { getResponse } from './common';
import { fetchResources, saveData } from './resources';

/*
eslint no-shadow: ["error", { "allow": ["data", "url", "fileName", "error"] }]
*/
/*
eslint-env es6
*/

export default (url, outputPath) => {
  const outputDir = outputPath || process.cwd();

  console.log('Url: ', url);
  console.log('Path: ', outputPath);
  console.log('Page will be saved as: ', outputDir);

  const response = getResponse(url);
  const data = fetchResources(response, url, outputDir);
  return saveData(data);
};
