/* eslint-disable more/no-hardcoded-configuration-data */
import https from 'https';

const HOSTNAME = 'maker.ifttt.com';
const PATH = '/trigger/debug/json/with/key/ftx03y04MuZH3GMzehSmJE4VN1aVK0VvMeoTEUn83QG';

export default function sendLog(data) {
    const json = JSON.stringify(data);

    const options = {
        protocol : 'https:',
        hostname : HOSTNAME,
        port     : 443,
        path     : PATH,
        method   : 'POST',
        headers  : {
            'Content-Type'   : 'application/json',
            'Content-Length' : json.length
        }
    };

    const req = https.request(options).on('error', error => {
        console.error('Request error:', error.message);
    });

    req.write(json);
    req.end();
}

