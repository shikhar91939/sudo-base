const os = require('os');
const osName = require('os-name');
const fs = require('fs');
const chalk = require('chalk');

/**
 * returns null if file doesn't exist, if its not macOs or if error in reading/parsing file
 * console.logs if not macOs or if error in reading/parsing file
 */
exports.readProfile = () => {
    const profileDir = getProfileDir();
    if (!profileDir){
        console.log(chalk.red('Sorry, only macOs is supported right now'));
        return null;
    }
    const filePath = profileDir + '.quickbase';
    if (!fs.existsSync(filePath))
        return null;
    try {
        return (JSON.parse(fs.readFileSync(filePath)));
    } catch (err) {
        console.log(chalk.red('error reading / parsing Quick Base profile'));
        return null;
    }
}

const getProfileDir = () => {
    const operatingSys = osName();
    if(operatingSys.startsWith('macOS')){
        return  os.homedir()+'/';
    } else {
        return null;
    }
}