#! /usr/bin/env node

import program from 'commander';
import * as app from '../../package.json';
import loadPage from '../';

program
  .version(app.version)
  .description('This program downloads html by given URL and save it to the local dir')
  .option('-o, --output [path]', 'output directory')
  .arguments('<url>')
  .action((url) => {
    try {
        loadPage(url, program.output);
    } catch (e) {
      console.log('Error: ', e);
    }
  });

  program.parse(process.argv);
