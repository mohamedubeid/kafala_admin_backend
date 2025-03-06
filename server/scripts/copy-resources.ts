import * as shell from 'shelljs';
import * as fs from 'fs';
import * as path from 'path';

const out = path.join(__dirname, '..', 'dist');
createFolderIfNotExist(out);

createFolderIfNotExist(path.join(out, 'config'));

shell.cp('-R', 'src/config/*.yml', 'dist/config');

shell.mkdir('-p', 'dist/templates');

shell.mkdir('-p', 'dist/templates/mails');

shell.cp('-R', 'src/templates/mails/*.ejs', 'dist/templates/mails');

shell.cp('-R', '.env', 'dist/.env');

let clientDist = path.join(__dirname, '..', '..', 'target', 'classes', 'static');

if (!fs.existsSync(clientDist)) {
  clientDist = path.join(__dirname, '..', '..', 'build', 'resources', 'main', 'static');
}

if (fs.existsSync(clientDist)) {
  shell.cp('-R', clientDist, out);
}

function createFolderIfNotExist(outDir: string): void {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }
}
