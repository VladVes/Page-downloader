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
    .then((response) => {
      return response.data;
    })
    .catch((httpErr) => {
      return new Error(httpErr);
    });
};

const writeToFile = (data, filenName) => {
  return fs.writeFile(filenName, data)
    .then(() => console.log('Page saved successfully'), (writeErr) => {
      return new Error(writeErr);
    });
};

const gen = function* (url, fileName) {
  console.log("URL FROM GENERATOR: ", url);
  console.log("FILENAME FROM GENERATOR: ", fileName);
  const data = yield getResponseData(url);
  //console.log("DATA: ", data);
  yield writeToFile(data, fileName);
};

export default (uri, outputPath) => {
  const directory = outputPath ? outputPath : __dirname;
  const fullFileName = makeFileName(uri, directory);

  console.log('URL given: ', uri);
  console.log('PATH GIVEN: ', outputPath);
  console.log("Page will be saved to: ", fullFileName);

  const coroutine = (generator) => {
    const process = generator(uri, fullFileName);
    const next = (result) => {
      const value = resul.value;
      if (result.done) {
        return value;
      }
      value.then(
        data => next(process.next(data)),
        err => next(process.throw(err))
      );
    }

    return next(process.next());
  };

  coroutine(gen);
};
