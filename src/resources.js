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

const getLinks = (html, selector, predicate) => {
  const $ = cheerio.load(html);
  return $(selector).toArray()
    .map((el) => {
      return { tag: el.name, src: el.attribs.src };
    })
    .filter((el) => !predicate.test(el.src));
};

const addLocalNamesToLinksColl = (linksColl) => {
  return linksColl.reduce((acc, el) => {
    const {root, dir, ext, name} = nodePath.parse(el.src);
    el.localSrc = `${root}${(nodePath.join(dir, name).replace(/\W/g, '-')).slice(1)}${ext}`;
    return [...acc, el];
  }, []);
};

const updateHtml = (html, localDir, linksColl) => {
  const result = linksColl.reduce((acc, el) => {
    const newSrc = `${localDir}${el.localSrc}`;
    const $ = cheerio.load(acc);
    $(`[src="${el.src}"]`).removeAttr('src').attr('src', newSrc);
    return $.html();
  }, html);

  return `${result}\n`;
};

const fetchResources = (response, url, localDir) => {
  console.log("FROM fetch!");
  return response.then(html => {

    getLinks(html, '[src]', /^(\w+:)?\/{2,}/);
  })
    .then(links => Promise.all(

    ))
    .catch(error => error.message);
};

export {getLinks, fetchResources, addLocalNamesToLinksColl, updateHtml};
