const minimist = require('minimist');


module.exports = async () => {
    const args = minimist(process.argv.slice(2));
    const cmd = args._[0];
    switch(cmd){
        case undefined:  // when we just enter 'qb'
            require('./cmds/qb')();//todo: if logged in, display username and pass. else ask to login
            break;
        case 'login':
            require('./cmds/login')(args);
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