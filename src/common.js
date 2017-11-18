import url from 'url';
import nodePath from 'path';
import fs from 'mz/fs';
import axios from 'axios';
import debug from 'debug';

/*
eslint no-shadow: ["error", { "allow": ["data", "url", "fileName", "error"] }]
*/
/*
eslint-env es6
*/
const log = debug('Page-loader');

const makeName = (uri, dir, type) => {
  const { host, path } = url.parse(uri);
  const name = `${host || ''}${path}`.replace(/\W/g, '-');
  return `${dir}${nodePath.sep}${name}${type}`;
};

const getResponse = (url, responseType) => axios({ method: 'get', url, responseType })
  .then(response => response.data, error => error.message);

const writeToFile = (resourse, fileName, type) => {
  const baseName = nodePath.basename(fileName);
  const defaultMessage = `${baseName} has been saved successfully!`;
  return resourse.then((data) => {
    if (type === 'img') {
      const stream = data.pipe(fs.createWriteStream(fileName));
      return nodePath.basename(stream.path);
    }
    return fs.writeFile(fileName, data);
  }).then(streamMessage => (streamMessage || defaultMessage))
    .catch(err => console.log(err.message));
};

export { makeName, getResponse, writeToFile };
