const os = require('os');
const fs = require('fs');
const chalk = require('chalk');

const TICKET_FILENAME= '.quickbase';

module.exports = async (args) => {
    const path = os.homedir()+'/'+TICKET_FILENAME;
    try {
        if (fs.existsSync(path)) {
             fs.unlinkSync(path);
        }
        console.log(chalk.green('logout successful'));
      } catch(err) {
        console.error('error deleting ticket file', err);
      }
}