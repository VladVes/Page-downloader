import url from 'url';
import nodePath from 'path';
import fs from 'mz/fs';
import cheerio from 'cheerio';
import { makeName, getResponse, writeToFile } from './common';

/*
eslint no-shadow: ["error", { "allow": ["data", "url", "fileName", "error"] }]
*/
/*
eslint-env es6
*/

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

const fetchResources = (response, url, dir) => {
  console.log("FROM fetch!");
  return response.then(html => {
    //console.log("FROM FETCH: ", html);
    getLinks(html);
  })
    .then(links => Promise.all(

    ))
    .catch(error => error.message);
};

export {getLinks, fetchResources};
