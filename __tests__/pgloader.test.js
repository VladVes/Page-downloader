import nock from 'nock';
import axios from 'axios';
import loadPage from '../src/';

beforeAll(() => {
  const address = 'http://test.page.com';
  const scope = nock(address)
    .get('/pathTo/resuorse')
    .reply(200, '<html><body>well done!</body></html>');

  axios.defaul.adapter = require('axios/lib/adapters/http');
});

describe('Testing upper function', () => {
  it('should be equal', (done) => {
    
    done();
  })
});
