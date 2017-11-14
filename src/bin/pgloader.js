#! /usr/bin/env node

import program from 'commander';
import * as app from '../../package.json';
import loadPage from '../';

program
  .version(app.version)
  .description('This program downloads html by given URL and save it to the local dir')
  .option('-o, --output [path]', 'directory to save downloaded page')
  .arguments('<url>')
  .action(url => loadPage(url, program.output).then(result => console.log(result)));

  program.parse(process.argv);
