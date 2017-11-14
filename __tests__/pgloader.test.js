import os from 'os';
import fs from 'mz/fs';
import path from 'path';
import nock from 'nock';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';
import loadPage from '../src/';

const address = 'https://github.com';
const pathToRes = '/VladVes';
const body = 'test data';
const successMessage = 'Page data has been saved successfully!';
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tests'));

axios.defaults.adapter = httpAdapter;

describe('Testing loadPage function', () => {
  beforeAll(() => {
    nock(address)
      .get(pathToRes)
      .reply(200, body);
  });
  afterAll(() => {

  });
  it('should return success message', () => {
    expect.assertions(1);
    return loadPage(`${address}${pathToRes}`, tmpDir).then((message) => {
      expect(message).toBe(successMessage);
    });
  });

  it('should write data to file', () => {
    const pathToFile = path.format({
      dir: tmpDir,
      base: 'github-com-VladVes.html',
    });
    expect(fs.readFileSync(pathToFile, 'utf8')).toBe('test data');
  });
});
