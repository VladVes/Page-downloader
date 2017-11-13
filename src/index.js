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

const getResponseDataGen = function* () {
  const url = yield;
  const data = yield axios.get(url)
    .then((response) => {
      return response.data;
    })
    .catch((httpErr) => {
      throw new Error(httpErr);
    });
};


export default (uri, outputPath) => {
  const directory = outputPath ? outputPath : __dirname;
  const fullFileName = makeFileName(uri, directory);

  console.log('URL given: ', uri);
  console.log('PATH GIVEN: ', outputPath);
  console.log("Page will be saved to: ", fullFileName);

  const dataGen = getResponseDataGen();
  dataGen.next();
  const { value } = dataGen.next(uri);
  value.then(data => dataGen.next(data));


};
