#! /usr/bin/env node

import program from 'commander';
import Listr from 'listr';
import * as app from '../../package.json';
import loadPage from '../';


program
  .version(app.version)
  .description('This program downloads resourse by given URL and save it to the local dir')
  .option('-o, --output [path]', 'directory to save downloaded page')
  .arguments('<url>')
  .action((url) => {
    const outputDir = program.output || process.cwd();
    const tasks = new Listr([
      {
        title: `Loading page: ${url}`,
        task: () => loadPage(url, outputDir)
          .then(message => message.forEach((msg) => {
            const task2 = new Listr([{ // this emulation is for experiment only
              title: `Fetching... ${msg}`,
              task: () => {},
            }]);
            task2.run();
          }))
          .catch((errMsg) => {
            throw new Error(`Something went wrong: ${errMsg}`);
          }),
      },
    ]);
    tasks.run();
  });

program.parse(process.argv);
