import nodeUrl from 'url';
import nodePath from 'path';
import cheerio from 'cheerio';
import { getResponse } from './common';

/*
eslint no-shadow: ["error", { "allow": ["data", "url", "fileName", "error"] }]
*/
/*
eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["el"] }]
*/
/*
eslint-env es6
*/

const getLinks = (html, selector, predicate) => {
  const $ = cheerio.load(html);
  return $(selector).toArray()
    .map((el) => {
      const src = el.attribs.src || el.attribs.href;
      return { type: el.name, src };
    })
    .filter(el => !predicate.test(el.src));
};

const updateLinks = (linksColl, dirName) =>
  linksColl.reduce((acc, el) => {
    const { dir, ext, name } = nodePath.parse(el.src);
    const newName = `${(nodePath.join(dir, name).replace(/\W/g, '-')).slice(1)}${ext}`;
    el.localSrc = nodePath.format({
      root: '/ignored',
      dir: dirName,
      base: newName,
      ext: 'ignored',
    });
    el.fileName = newName;
    return [...acc, el];
  }, []);

const updateHtml = (html, linksColl) => {
  const result = linksColl.reduce((acc, el) => {
    const attrib = el.type === 'link' ? 'href' : 'src';
    const $ = cheerio.load(acc);
    $(`[${attrib}="${el.src}"]`).removeAttr(attrib).attr(attrib, el.localSrc);
    return $.html();
  }, html);

  return `${result}\n`;
};

const fetchResources = (html, url, resourcesDir, htmlFileName) => {
  const linksColl = getLinks(html, 'img[src], script[src], link[href]', /^(\w+:)?\/{2,}/);
  const updatedLinksColl = updateLinks(linksColl, resourcesDir);
  const updatedHtml = updateHtml(html, updatedLinksColl);
  const coll = [
    { type: 'html', data: Promise.resolve(updatedHtml), location: htmlFileName },
  ];
  const result = updatedLinksColl.reduce((acc, el) => {
    const responseType = el.type === 'img' ? 'stream' : 'json';
    const { protocol, host } = nodeUrl.parse(url);
    console.log('Fetching... ', `${protocol}//${host}${el.src}`);
    const newEl = {
      type: el.type,
      data: getResponse(`${protocol}//${host}${el.src}`, responseType),
      location: `${resourcesDir}${nodePath.sep}${el.fileName}`,
    };
    return [...acc, newEl];
  }, coll);

  return result;
};

export { getLinks, fetchResources, updateLinks, updateHtml };
