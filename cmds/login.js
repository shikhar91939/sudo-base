const inquirer = require('inquirer');
const axois = require('axios');
const querystring = require('querystring'); // move to 'only when needed'
const parseString = require('xml2js').parseString;
const os = require('os');
const osName = require('os-name');
const fs = require('fs');
const chalk = require('chalk');

const TICKET_FILENAME= '.quickbase';

const realmQues = {
    name: 'realm',
    message: 'realm:',
};
const usernameQues = {
    name: 'username',
    message: 'username:',
}
const passQues = {
    type: 'password',
    name: 'password',
    message: 'password:',
    mask: '',
}

module.exports = async (args) => {
    const loginData = await inquirer.prompt([realmQues, usernameQues, passQues]);
    const credentials = {
        username: loginData.username,
        password: loginData.password,
    }
    const response = await login(loginData.realm, credentials);
    const {ticket, path} = handleLoginResponse(response);
    if (path && ticket) {
        const sessionDetails = { ...credentials, realm: loginData.realm, ticket};
        saveUserDetails(path, sessionDetails);
        console.log(chalk.green('login successful'));
    } else{
        console.log(chalk.red('login failed'));
    }
}

const handleLoginResponse = (response) => {
    var tags = null;
    parseString(response.data, (err, result) => {
        if (err) {
            console.error('error while parsing login response:', err);
            return null;
        }
        tags = result;
    })
    if(tags.qdbapi.errcode[0] === '0'){
        return onSuccessfulLogin(tags.qdbapi);
    } else {
        showLoginError(tags.qdbapi);
        return null;
    }
}

const showLoginError = (tags) => {
    console.error('failed to login');
    console.error('error code:', tags.errcode[0]);
    console.error('error text:', tags.errtext[0]);
    process.exit(1);
}

const onSuccessfulLogin = (tags)=> {
    const ticket = tags.ticket[0];
    const operatingSys = osName();
    if(operatingSys.startsWith('macOS')){
        const path = os.homedir() + '/';
        return {ticket, path};
    } else {
        console.error('Sorry, only macs are supported right now');
        return null;
    }
}

const saveUserDetails = (directory, sessionDetails) => {
    const completePath = directory + TICKET_FILENAME;
    try {
        writeFile(completePath, JSON.stringify(sessionDetails));
        // we don't care if the file already exists. We just overwrite.
      } catch(err) {
        console.error(err)
      }
}

const writeFile = (completePath, data) => {
    try {
        fs.writeFile(completePath, data, () => {
        });
     } catch (err) {
          console.error('error during writing file:', err);
     }
}

const login = async (realm, credentials) => {
    const url = 'https://' + realm + '.quickbase.com/db/main';
    // const url = 'https://webhook.site/60fd4716-07cf-4ae6-b7d9-00865a46b782';
    const headers = {
        'QUICKBASE-ACTION': 'API_Authenticate',
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
    }
    return axois({
        method: 'post',
        url: url,
        headers: headers,
        data: querystring.stringify(credentials),
    })
    .then(onResponse = (response) => {
        return response;
    }).catch( (error) => {
        console.error('error in login', error);
        return null;
    });
}
