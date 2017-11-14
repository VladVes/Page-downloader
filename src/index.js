require("babel-core/register");
require("babel-polyfill");
import url from 'url';
import nodePath from 'path';
import axios from 'axios';
import fs from 'mz/fs';

const makeFileName = (uri, dir) => {
  const { host, path } = url.parse(uri);
  const fileName = `${host}${path}`.slice(0, -1).replace(/[^\w]/g, '-');
  return `${dir}${nodePath.sep}${fileName}.html`;
};

const getResponseData = (url) => {
  return axios.get(url)
    .then(response => response.data, httpErr => Promise.reject(httpErr.message));
};

const writeToFile = (data, filenName) => {
  const message = 'Page data has been saved successfully!';
  return fs.writeFile(filenName, data)
    .then(() => message, writeErr => Promise.reject(writeErr.message));
};

const gen = function* (url, fileName) {
  try {
    const pageData = yield getResponseData(url);
    const result = yield writeToFile(pageData, fileName);
    return result;
  } catch (e) {
      return `Err: ${e}`;
  }
};

export default (uri, outputPath) => {
  const directory = outputPath ? outputPath : __dirname;
  const fullFileName = makeFileName(uri, directory);

  console.log('Url: ', uri);
  console.log('Path: ', outputPath);
  console.log("Page will be saved as: ", fullFileName);

  const coroutine = (generator) => {
    const iterator = generator(uri, fullFileName);
    const next = (result) => {
      const value = result.value;
      if (result.done) {
        return value;
      }
      
      return value.then(
        data => next(iterator.next(data)),
        err => next(iterator.throw(err))
      );
    }

    return next(iterator.next());
  };

  return coroutine(gen);
};
