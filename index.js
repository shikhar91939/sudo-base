const inquirer = require('inquirer');
const axois = require('axios');
const querystring = require('querystring'); // move to 'only when needed'
const parseString = require('xml2js').parseString;
const os = require('os');
const osName = require('os-name');
const fs = require('fs');

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

module.exports = async () => {
    saveTicket('hellllooooo');
    console.log('To use Quick Base, please login with your realm, username and password');
    const loginData = await inquirer.prompt([realmQues, usernameQues, passQues]);
    const response = await login(loginData);
    handleLogin(response);
}

const handleLogin = (response) => {
    // console.log('response.headers:', response.headers);
    // console.log('response.data:', response.data);
    var tags = null;
    parseString(response.data, (err, result) => {
        // console.log('result:', result);
        if (err) console.log('err:', err);
        tags = result;
    })
    if(tags.qdbapi.errcode[0] === '0'){
        console.log('login successful');
        onSuccessfulLogin(tags.qdbapi);
    } else {
        console.log('failed to login');
        showLoginError(tags.qdbapi);
    }
}

const showLoginError = (tags) => {
    console.log('tags:', tags);
    console.log('error code:', tags.errcode);
    console.log('error text:', tags.errtext);
}

const onSuccessfulLogin = (tags)=> {
    const ticket = tags.ticket[0];
    console.log(ticket);
    const operatingSys = osName();
    if(operatingSys.startsWith('macOS')){
        saveTicket(ticket);
    } else {
        console.log('Sorry, only macs are supported right now');
    }
}

const saveTicket = (ticket) => {
    const path = '/';
    try {
        if (fs.existsSync(path)) {
            console.log('exists');
        } else {
            console.log("doesn't exist");
        }
      } catch(err) {
        console.error(err)
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
        // console.log(response);
        return response;
    }).catch( (error) => {
        console.log('error in login', error);
        return null;
    });
}
