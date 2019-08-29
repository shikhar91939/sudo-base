const os = require('os');
const fs = require('fs');
const chalk = require('chalk');
const helpers = require('../helpers');
const axois = require('axios');
const inquirer = require('inquirer');  // already being used
// const enquirer = require('enquirer'); //need for auto complete prompt
const _ = require('lodash');

const TICKET_FILENAME= '.qb-ticket';

// const selectApps = new enquirer.Autocomplete({
//     name: 'selectdcApp',
//     message: 'select an app:',
//     limit: 10,
//     choices: ['asd', 'qer', 'sdf', 'zcvz', 'qwer', 'fzvzf', 'qrdfa', 'asdfzcv', 'zcv', 'asdf','asdff'],
// });

module.exports = async (args) => {
    const loginData = helpers.readProfile();
    const apps = extractApps(await getApps(loginData));
    const selectApps = {
        type: 'rawlist',
        name: 'selectedApp',
        message: 'select an app:',
        choices: apps,
        default: 0,
    };
    
    const app = await inquirer.prompt([selectApps]);
    // const app = await selectApps.run();

    console.log(app);
    
}

const getApps = async (loginData) => {
    // console.log('remove this return');
    // return 'remove this return';
    // const url = 'https://webhook.site/60fd4716-07cf-4ae6-b7d9-00865a46b782';
    const url = 'https://' + loginData.realm+ '.quickbase.com' + '/governance/apps';
    // console.log(url);
    const headers = {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
        "cookie": "TICKET= " + loginData.ticket,
      }
    return axois ({
        method: 'get',
        url: url,
        headers: headers
    }).then(onResponse = (response) => {
    //    console.log(response);
        return response;
    }).catch((error) => {
        console.log(chalk.red('error getting apps data.', error));
        return null;
    });
}

const extractApps = (response) => {
    // todo: if login-error, ask to login instead, elseif display errcode, else execute rest of the code
    const rawApps = response.data;
    const apps = _.map(rawApps, (app) => {return app.appName + ' id:' + app.appid});
    return apps;
}