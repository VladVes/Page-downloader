import os from 'os';
import fs from 'mz/fs';
import path from 'path';
import nock from 'nock';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import {getLinks, fetchResources, addLocalNamesToLinksColl, updateHtml} from '../src/resources';

/*
const address = 'https://hexlet.io';
const pathToRes = '/courses';
*/

axios.defaults.adapter = httpAdapter;

describe('Fetch resuourses and save to local dir', () => {
/*
  BeforeAll(() => {
    const fixture = path.format({
      dir: '__fixtures__',
      base: 'source.html',
    });
    const html = fs.readFileSync(fixture, 'utf8');
    nock(address)
      .get(pathToRes)
      .reply(200, html);
  });
*/
  const getFixture = (name) => {
    return path.format({
      dir: __dirname,
      base: `__fixtures__${path.sep}${name}.html`,
    });
  };

  it('should return local links', () => {
    const html = fs.readFileSync(getFixture('source'), 'utf8');
    const expected = [
      {tag: 'img', src: '/imgPth1/img.png'},
      {tag: 'script', src: '/local/script.js'},
      {tag: 'img', src: '/local/image.jpg'},
      {tag: 'link', src: '/local/link.lnk'},
    ];
    expect(getLinks(html, '[src]', /^(\w+:)?\/{2,}/)).toEqual(expected);
  });

  it('should update links collection with local names', () => {
    const coll = [
      {tag: 'img', src: '/imgPth1/img.png'},
      {tag: 'script', src: '/first/second/script.js'},
    ];
    const expected = [
      {tag: 'img', src: '/imgPth1/img.png', localSrc: '/imgPth1-img.png'},
      {tag: 'script', src: '/first/second/script.js', localSrc: '/first-second-script.js'},
    ];

    expect(addLocalNamesToLinksColl(coll)).toEqual(expected);
  });

  it('should update html with local links', () => {
    const url = 'https://example.com/assets';
    const html = fs.readFileSync(getFixture('source'), 'utf8');
    const expected = fs.readFileSync(getFixture('dist'), 'utf8');
    const linksColl = addLocalNamesToLinksColl(getLinks(html, '[src]', /^(\w+:)?\/{2,}/));
    const localDir = 'example-com-assets_files';

    expect(updateHtml(html, localDir, linksColl)).toBe(expected);
  });



});
