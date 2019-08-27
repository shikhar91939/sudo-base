const inquirer = require('inquirer');
const axois = require('axios');

const realmQ = {
    name: 'realm',
    message: 'what is the realm you want to connect to?',
};
const usernameQ = {
    name: 'username',
    message: 'your username:',
}
const passQ = {
    type: 'password',
    name: 'password',
    mask: '',
}

module.exports = async () => {
    console.log('Welcome to Quick Base. Please login to continue');
    const creds = await inquirer.prompt([realmQ, usernameQ, passQ]);
    login(creds);
}
const login = (creds) => {
    const url = 'https://'+creds.realm+'.quickbase.com/db/main';
    // const url = 'https://webhook.site/60fd4716-07cf-4ae6-b7d9-00865a46b782';
    console.log(url);
    
    const auth = {
        'QUICKBASE-ACTION': 'API_Authenticate',
        // 'Content-Type': 'application/xml',
        username: creds.username,
        password: creds.password,
    }
    axois.post(url, auth).then(onResponse = (response) => {
        console.log(response);
    }).catch( (error) => {
        console.log('error while login', error);
    });
}
