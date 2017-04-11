// ======================================================================
// API fetch call
// ======================================================================

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

// ======================================================================
// API call function presets
// ======================================================================

const allCollaboratorsOfRepo = (owner, repo) => {
    return '/repos/' + owner + '/' + repo + '/collaborators';
};

const allCommitsOfRepoByUser = (owner, repo, user) => {
    return '/repos/' + owner + '/' + repo + '/commits?author=' + user;
};

const allCommitsOfRepoByUserInRange = (owner, repo, user, start, end) => {
    return '/repos/' + owner + '/' + repo + '/commits?author=' + user + 
           '&?since=' + start + '&?until=' + end;
};

// Requires further processing
// See https://developer.github.com/v3/repos/statistics/
// Can also be used to check by week
const allInsDelOfRepo = (owner, repo) => {
    return '/repos/' + owner + '/' + repo + '/stats/contributors';
};

const allCommitsOfFile = (owner, repo, filepath) => {
    return '/repos/' + owner + '/' + repo + '/commits?path=' + filepath;
};

// Use Javascript Date object to manage subtracting days
// http://stackoverflow.com/questions/563406/add-days-to-javascript-date
const allCollaboratorsOfRepoInLastWeek = (owner, repo, lastweek) => {
    return '/repos/' + owner + '/' + repo + '/collaborators?since=' + lastweek;
};