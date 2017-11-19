import fs from 'mz/fs';
import path from 'path';
import {getLinks, updateLinks, updateHtml} from '../src/resources';


describe('Data handlers', () => {

  const getFixture = (name) => {
    return path.format({
      dir: __dirname,
      base: `__fixtures__${path.sep}${name}.html`,
    });
  };

  it('should return local links', () => {
    const html = fs.readFileSync(getFixture('source'), 'utf8');
    const expected = [
      {type: 'img', src: '/imgPth1/img.png'},
      {type: 'script', src: '/local/script.js'},
      {type: 'img', src: '/local/image.jpg'},
      {type: 'link', src: '/local/link.css'},
    ];
    expect(getLinks(html, 'img[src], script[src], link[href]', /^(\w+:)?\/{2,}/)).toEqual(expected);
  });

  it('should update links collection', () => {
    const dir = `example-com`;
    const coll = [
      {
        type: 'img',
        src: '/imgPth1/img.png',
      },
    ];
    const expected = [
      {
        type: 'img',
        src: '/imgPth1/img.png',
        localSrc: 'example-com/imgPth1-img.png',
        fileName: 'imgPth1-img.png',
      },
    ];

    expect(updateLinks(coll, dir)).toEqual(expected);
  });

  it('should update html with local links', () => {
    const url = 'https://example.com/assets';
    const html = fs.readFileSync(getFixture('source'), 'utf8');
    const expected = fs.readFileSync(getFixture('dist'), 'utf8');
    const localDir = 'example-com-assets_files';
    const linksColl = updateLinks(getLinks(html, 'img[src], script[src], link[href]', /^(\w+:)?\/{2,}/), localDir);

    expect(updateHtml(html, linksColl)).toBe(expected);
  });



});
