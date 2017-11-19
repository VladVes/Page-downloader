import fs from 'fs';
import os from 'os';
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
  it('should return ENOENT write error', () => {
    const fileName = path.format({
      dir: 'wrongDir',
      base: 'hexlet-io-courses.html',
    });
    const errCode = 'ENOENT';
    const expected = `${errCode}: no such file or directory, open 'wrongDir/hexlet-io-courses.html'`;
    expect.assertions(1);
    return writeToFile(Promise.resolve(data), fileName, 'txt').catch((err) => {
      expect(err.message).toBe(expected);
    });
  });

  it('should return EACCES write error', () => {
    const tmpDir = mkdirTmp();
    const fineName = 'alredyexist.html';
    const pathToFile = path.format({
      dir: tmpDir,
      base: fineName,
    });
    fs.writeFileSync(pathToFile, data);
    fs.chmodSync(pathToFile, 0);
    const errCode = 'EACCES';
    const expected = `${errCode}: permission denied, open '${pathToFile}'`;
    expect.assertions(1);
    return writeToFile(Promise.resolve(data), pathToFile, 'txt').catch((err) => {
      expect(err.message).toBe(expected);
    });
  });

  it('should return 404 http error', () => {
    nock('https://hexlet.io')
      .get('/nopage')
      .reply(404, data);
    const errCode = '404';
    const expected = `Request failed with status code ${errCode}`;
    expect.assertions(1);
    return getResponse('https://hexlet.io/nopage').catch((err) => {
      console.log(err.message);
      expect(err.message).toBe(expected);
    });
  });

});
