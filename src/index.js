import url from 'url';
import nodePath from 'path';
import axios from 'axios';
import fs from 'mz/fs';
import cheerio from 'cheerio';
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

const getResource = (url, responseType) => {
  return axios({ method: 'get', url, responseType })
    .then(response => response.data, error => Promise.reject(error));
};

const writeToFile = (resourse, filenName) => {
  const sucMessage = `${filenName} has been saved successfully!`;
  return resourse.then(
    data => fs.writeFile(filenName, data),
    error => `Error: ${error.message}`,
  ).then(errMessage => errMessage || sucMessage);
};

const getLinks = (html) => {
//  console.log("FROM get links!!!: ", html);
  const $ = cheerio.load(html);
  //const result = $('img, link, script').toArray()
  const result = $('[src]').toArray()
    .map((el) => {
      //console.log("FROM MAP ALL: ", el);
      console.log("FROM MAP : ", { tag: el.name, src: el.attribs.src });
      return { tag: el.name, src: el.attribs.src }; })
    .filter((el) => !/^(\w+:)?\/{2,}/.test(el.src));
  console.log("FROM get links RESULT : ", result);
  return result;
};

const fetchResourses = (response, url, dir) => {
  console.log("FROM fetch!");
  return response.then(html => {
    //console.log("FROM FETCH: ", html);
    getLinks(html);
  })
    .then(links => Promise.all(

    ))
    .catch(error => error.message);
};

export default (url, outputPath) => {
  const outputDir = outputPath || process.cwd();
  const fileName = makeName(url, outputDir, '.html');
  const resDirName = makeName(url, outputDir, '_files');

  console.log('Url: ', url);
  console.log('Path: ', outputDir);
  console.log('Page will be saved as: ', fileName);

  const response = getResource(url);
  //const html = '<html><body><link><img><script id="first" class="old" src="http://hexet.io/scritpsrc"></script><img src="imgPth1/img.png"><img src="/imgPth2/image.jpg"><p>text</p><link src="lnksrc/ling.nlk"></body></html>';
  const links = fetchResourses(response, url, resDirName);
  //const newHtml = convertLinksToLocal(links, response);

  return writeToFile(Promise.resolve('some data'), fileName);
};
