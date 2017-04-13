// ======================================================================
// API call function presets
// ======================================================================

export const allCollaboratorsOfRepo = (owner, repo) => {
    return '/repos/' + owner + '/' + repo + '/collaborators';
};

export const allCommitsOfRepoByUser = (owner, repo, user) => {
    return '/repos/' + owner + '/' + repo + '/commits?author=' + user;
};

export const allCommitsOfRepoByUserInRange = (owner, repo, user, start, end) => {
    return '/repos/' + owner + '/' + repo + '/commits?author=' + user + 
           '&?since=' + start + '&?until=' + end;
};

// Requires further processing
// See https://developer.github.com/v3/repos/statistics/
// Can also be used to check by week
export const allInsDelOfRepo = (owner, repo) => {
    return owner + '/' + repo + '/contribution';
};

export const allCommitsOfFile = (owner, repo, filepath) => {
    return '/repos/' + owner + '/' + repo + '/commits?path=' + filepath;
};

// Use Javascript Date object to manage subtracting days
// http://stackoverflow.com/questions/563406/add-days-to-javascript-date
export const allCollaboratorsOfRepoInLastWeek = (owner, repo, lastweek) => {
    return '/repos/' + owner + '/' + repo + '/collaborators?since=' + lastweek;
};