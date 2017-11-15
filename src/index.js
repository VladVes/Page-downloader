import 'babel-polyfill';
import url from 'url';
import nodePath from 'path';
import axios from 'axios';
import fs from 'mz/fs';

/*
eslint no-shadow: ["error", { "allow": ["data", "url", "fileName", error] }]
*/
/*
eslint-env es6
*/

const makeFileName = (uri, dir) => {
  const { host, path } = url.parse(uri);
  const fileName = `${host}${path}`.replace(/\W/g, '-');
  return `${dir}${nodePath.sep}${fileName}.html`;
};

const getResponseData = url => axios.get(url)
  .then(response => response.data, error => Promise.reject(error.message));

const writeToFile = (response, filenName) => {
  const message = 'Page data has been saved successfully!';
  response.then(data => fs.writeFile(filenName, data)
    .then(() => message, error => Promise.reject(error.message)));
};

export default (url, outputPath) => {
  const directoryToSave = outputPath || process.cwd();
  const fileName = makeFileName(url, directoryToSave);

  console.log('Url: ', url);
  console.log('Path: ', directoryToSave);
  console.log('Page will be saved as: ', fileName);

  const response = getResponseData(url);
  const result = writeToFile(response, fileName);

  console.log("DATA: ", data);
  console.log("RESULT: ", result);
  return result;
};
