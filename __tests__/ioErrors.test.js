import path from 'path';
import nock from 'nock';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import { writeToFile, getResponse } from '../src/common';

const address = 'https://hexlet.io';
const pathToRes = '/courses';
const data = 'test data';
const mkdirTmp = () => fs.mkdtempSync(path.join(os.tmpdir(), '_tests_'));
axios.defaults.adapter = httpAdapter;

describe('IO errors', () => {
  beforeAll(() => {
    nock(address)
      .get(pathToRes)
      .reply(200, data);
  });
  it('should return write ENOENT error', () => {
    const fileName = path.format({
      dir: 'wrongDir',
      base: 'hexlet-io-courses.html',
    });
    const errCode = 'ENOENT';
    const expected = `${errCode}: no such file or directory, open 'wrongDir/hexlet-io-courses.html'`;
    expect.assertions(1);
    return writeToFile(Promise.resolve(data), fileName, 'txt').catch((err) => {
      //console.log(err);
      expect(err.message).toBe(expected);
    });
  });
  /*
  it('should return write BIN data ENOENT error', () => {
    const fileName = path.format({
      dir: 'wrongDir',
      base: 'hexlet-io-courses.html',
    });
    const data = getResponse(`${address}${pathToRes}`, 'stream');
    const errCode = 'ENOENT';
    const expected = `${errCode}: no such file or directory, open 'wrongDir/hexlet-io-courses.html'`;
    expect.assertions(1);
    return writeToFile(data, fileName, 'img').catch((err) => {
      console.log(err);
      expect(err.message).toBe(expected);
    });
  });
  */

});
