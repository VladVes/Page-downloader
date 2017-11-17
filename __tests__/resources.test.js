import os from 'os';
import fs from 'mz/fs';
import path from 'path';
import nock from 'nock';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import {getLinks, fetchResources} from '../src/resources';

/*
const address = 'https://hexlet.io';
const pathToRes = '/courses';
*/

axios.defaults.adapter = httpAdapter;

describe('Function should fetch resuourses and save to local dir', () => {
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

  it('should return local links', () => {
    const fixture = path.format({
      dir: __dirname,
      base: '__fixtures__/source.html',
    });
    console.log('fixture: ', fixture);
    const html = fs.readFileSync(fixture, 'utf8');
    const expected = [
      {tag: 'img', src: '/imgPth1/img.png'},
      {tag: 'script', src: '/local/script.js'},
      {tag: 'img', src: '/local/image.jpg'},
      {tag: 'link', src: '/local/link.lnk'},
    ];
    expect(getLinks(html)).toEqual(expected);
  });

});
