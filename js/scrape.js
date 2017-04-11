const paToken = 'e7c496d46867a3a0c091cb9fe8fdf71dc73b2b2e';
const paUser = 'phadrian';
const endPoint = 'https://api.github.com';

const credentials = paUser + ':' + paToken;
const auth = btoa(credentials);

const options = {
    mode: 'cors',
    headers: {
        'Authorization': 'Basic ' + auth,
    }
}

const api = (path) => {
    return fetch(endPoint + path, options)
        .then(
            response => response.json(),
            err => console.error('Error fetching', err)
        )
        .then(
            json => console.log('JSON', json),
            err => console.error('Error parsing', err)
        );
}