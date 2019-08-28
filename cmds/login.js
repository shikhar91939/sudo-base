const inquirer = require('inquirer');
const axois = require('axios');
const querystring = require('querystring'); // move to 'only when needed'
const parseString = require('xml2js').parseString;
const os = require('os');
const osName = require('os-name');
const fs = require('fs');
const TICKET_FILENAME= '.qb-ticket';
const chalk = require('chalk');

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
    const response = await login(loginData);
    handleLogin(response);
}

const handleLogin = (response) => {
    var tags = null;
    parseString(response.data, (err, result) => {
        if (err) console.error('error while parsing login response:', err);
        tags = result;
    })
    if(tags.qdbapi.errcode[0] === '0'){
        onSuccessfulLogin(tags.qdbapi);
        console.log(chalk.green('login successful'));
    } else {
        showLoginError(tags.qdbapi);
    }
}

const showLoginError = (tags) => {
    console.error('failed to login');
    console.error('error code:', tags.errcode[0]);
    console.error('error text:', tags.errtext[0]);
}

const onSuccessfulLogin = (tags)=> {
    const ticket = tags.ticket[0];
    const operatingSys = osName();
    if(operatingSys.startsWith('macOS')){
        saveTicket(ticket);
    } else {
        console.error('Sorry, only macs are supported right now');
    }
}

const saveTicket = (ticket) => {
    const path = os.homedir()+'/'+TICKET_FILENAME;
    try {
        if (fs.existsSync(path)) {
            writeFile(path, ticket);
        } else {
            writeFile(path, ticket);
        }
      } catch(err) {
        console.error(err)
      }
}

const writeFile = (path, data) => {
    try {
        fs.writeFile(path, data, () => {
        });
     } catch (err) {
          console.error('error during writing file:', err);
     }
}

const login = async (loginData) => {
    const url = 'https://'+loginData.realm+'.quickbase.com/db/main';
    // const url = 'https://webhook.site/60fd4716-07cf-4ae6-b7d9-00865a46b782';
    const headers = {
        'QUICKBASE-ACTION': 'API_Authenticate',
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
    }
    const credentials = {
        username: loginData.username,
        password: loginData.password,
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
