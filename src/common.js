import url from 'url';
import nodePath from 'path';
import fs from 'mz/fs';
import axios from 'axios';

/*
eslint no-shadow: ["error", { "allow": ["data", "url", "fileName", "error"] }]
*/
/*
eslint-env es6
*/

const makeName = (uri, dir, type) => {
  const { host, path } = url.parse(uri);
  const name = `${host || ''}${path}`.replace(/\W/g, '-');
  return `${dir}${nodePath.sep}${name}${type}`;
};

const getResponse = (url, responseType) => {
  return axios({ method: 'get', url, responseType })
    .then(response => response.data, error => Promise.reject(error));
};

const writeToFile = (resourse, filenName, type) => {
  const sucMessage = `${filenName} has been saved successfully!`;
  return resourse.then(
    (data) => {
      if(type === 'img') {
        return data.pipe(fs.createWriteStream(fileName));
      }
      return fs.writeFile(filenName, data);
    },
    error => `Error: ${error.message}`,
  ).then(errMessage => (errMessage || sucMessage));
};

export {makeName, getResponse, writeToFile};
