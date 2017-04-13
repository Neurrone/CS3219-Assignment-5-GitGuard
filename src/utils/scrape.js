import * as auth from './auth.js';

// ======================================================================
// API fetch call
// ======================================================================
const paToken = auth.GIT_TOKEN;
const paUser = auth.GIT_USER;
const endPoint = 'https://api.github.com';

const credentials = paUser + ':' + paToken;
const authCred = btoa(credentials);

const options = {
    mode: 'cors',
    headers: {
        'Authorization': 'Basic ' + authCred,
    }
}

export const api = (path, cb) => {
    return fetch(endPoint + path, options)
        .then(
            response => response.json(),
            err => console.error('Error fetching', err)
        )
        .then(
            json => {
                console.log('Running callback');
                cb(json);
            },
            err => console.error('Error parsing JSON', err)
        );
}

export const apiTwoPaths = (path1, path2, cb) => {
    return fetch(endPoint + path1, options)
        .then(
            response => response.json(),
            err => console.error('Error fetching', err)
        )
        .then(
            json1 => {
                console.log('Running callback');
                fetch(endPoint + path2, options)
                .then(
                    response => response.json(),
                )
                .then(
                    json2 => {
                        console.log('downloaded both');
                        console.log(json1);
                        console.log(json2);
                        cb(json1, json2);
                    }
                )
            },
            err => console.error('Error parsing JSON', err)
        );
}