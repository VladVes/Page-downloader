import nodeUrl from 'url';
import nodePath from 'path';
import cheerio from 'cheerio';
import { getResponse, writeToFile } from './common';

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

const fetchResources = (response, url, resourcesDir, htmlFileName) =>
  response
    .then((html) => {
      const linksColl = getLinks(html, 'img[src], script[src], link[href]', /^(\w+:)?\/{2,}/);
      const updatedLinksColl = updateLinks(linksColl, resourcesDir);
      const updatedHtml = updateHtml(html, updatedLinksColl);
      return { html: updatedHtml, links: updatedLinksColl };
    })
    .then((result) => {
      const preparedData = [
        { type: 'text', data: Promise.resolve(result.html), location: htmlFileName },
      ];
      return result.links.reduce((acc, el) => {
        const responseType = el.type === 'img' ? 'stream' : 'json';
        const { protocol, host } = nodeUrl.parse(url);
        const uri = `${protocol}//${host}${el.src}`;
        console.log('Fetching... ', uri);
        const resp = getResponse(uri, responseType);
        const updatedEl = {
          type: el.type,
          data: resp,
          location: `${resourcesDir}${nodePath.sep}${el.fileName}`,
        };
        return [...acc, updatedEl];
      }, preparedData);
    })
    .catch(error => console.log(error.message));

const saveData = dataColl =>
  dataColl
    .then(data => Promise.all(data.map(el => writeToFile(el.data, el.location, el.type))))
    .catch(err => err.message);

export { getLinks, fetchResources, updateLinks, updateHtml, saveData };
