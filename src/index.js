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
  .then(response => response.data, error => Promise.reject(error));

const writeToFile = (responseData, filenName) => {
  const sucMessage = 'Page data has been saved successfully!';
  return responseData
    .then(
      data => fs.writeFile(filenName, data),
      responseError => `Error: ${responseError.message}`
    )
    .then(errMessage => errMessage || sucMessage);
};

export default (url, outputPath) => {
  const dir = outputPath || process.cwd();
  const fileName = makeFileName(url, dir);

  console.log('Url: ', url);
  console.log('Path: ', dir);
  console.log('Page will be saved as: ', fileName);

  return writeToFile(getResponseData(url), fileName);
};
