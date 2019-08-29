const chalk = require('chalk');

module.exports = async (args) => {
    const profile = require('../helpers.js').readProfile();
    if (profile===null){
        console.log('To use Quick Base, please login with your realm, username and password');
        require('./login')();
    } else {
        console.log('logged in as ' + chalk.green(profile.username)
            + ' in ' + chalk.green(profile.realm) + ' realm');
    }
}