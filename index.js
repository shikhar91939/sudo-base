const inquirer = require('inquirer');
const axois = require('axios');
const querystring = require('querystring'); // move to 'only when needed'

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
    console.log('To use Quick Base, please login with your realm, username and password');
    const loginData = await inquirer.prompt([realmQues, usernameQues, passQues]);
    login(loginData);
}
const login = (loginData) => {
    const url = 'https://'+loginData.realm+'.quickbase.com/db/main';
    // const url = 'https://webhook.site/60fd4716-07cf-4ae6-b7d9-00865a46b782';
    const headers = {
        'QUICKBASE-ACTION': 'API_Authenticate',
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',// application/xml
    }
    const credentials = {
        username: loginData.username,
        password: loginData.password,
    }

    axois({
        method: 'post',
        url: url,
        headers: headers,
        data: querystring.stringify(credentials),
    })
    .then(onResponse = (response) => {
        console.log(response);
    }).catch( (error) => {
        console.log('error in login', error);
    });
}
