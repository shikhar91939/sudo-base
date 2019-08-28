
const apps = (ticket, loginData) => {
    const url = ‘https://’ + loginData.realm+ ‘.quickbase.com’ + APPS_URL;
    console.log(‘ticket ooo ticket:’ + ticket);
    const headers = {
        Accept: ‘text/html,application/xhtml+xml,application/xmlapplication/json’,
        Cookie: “TICKET= “+ ticket,
    }
    return axois ({
        method: ‘get’,
        url: url,
        headers: headers
    }).then(onResponse = (response) => {
       // console.log(response);
        return response;
    }).catch((error) => {
        console.log(‘error getting apps data’, error);
        return null;
    });
 }
 
 const getTicket = () => {
    const path = os.homedir()+‘/’+TICKET_FILENAME;
    fs.readFile(path, ‘utf8’, function (err, data) {
        if (err) {
            throw err;
        }
        console.log(‘Ticket read from file ’ + path +‘:’ + data);
        return data;
    });
 }