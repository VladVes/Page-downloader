#! env node

import program from 'commander';
import * as app from '../../package.json';
import pageLoad from '../';

program
  .version(app.version)
  .description('This program downloads html by given URL and save it to the local dir')
  .option('-o, --output', 'output directory')
  .arguments('<url>')
  .action((url) => {
    try {
        pageLoad(url, program.output);
    } catch (e) {
      console.log('Error: ', e);
    }
  });

  program.parse(process.argv);
