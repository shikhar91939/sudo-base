const minimist = require('minimist');


module.exports = async () => {
    const args = minimist(process.argv.slice(2));
    const cmd = args._[0];
    switch(cmd){
        case 'login':
            require('./cmds/login')(args);
            break;
        case undefined:
            console.log('To use Quick Base, please login with your realm, username and password');
            require('./cmds/login')();//todo: if logged in, display username and pass. else ask to login
            break;
        case 'logout':
            require('./cmds/logout')(args);
            break;
        case 'apps':
            require('./cmds/apps')(args);
            break;
        default:
            console.error(`"${cmd}" is not a valid command!`);
            break;
    }
}