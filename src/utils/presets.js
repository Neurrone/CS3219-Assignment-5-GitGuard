// ======================================================================
// API call function presets
// ======================================================================

export const allCollaboratorsOfRepo = (owner, repo) => {
    return '/repos/' + owner + '/' + repo + '/collaborators';
};

export const allCommitsOfRepoByUserInRange = (owner, repo, user, start, end) => {
    return '/repos/' + owner + '/' + repo + '/commits?author=' + user + 
           '&?since=' + start + '&?until=' + end;
};

export const allCommitsOfFile = (owner, repo, filepath) => {
    return '/repos/' + owner + '/' + repo + '/commits?path=' + filepath;
};

// Use Javascript Date object to manage subtracting days
// http://stackoverflow.com/questions/563406/add-days-to-javascript-date
export const allCollaboratorsOfRepoInLastWeek = (owner, repo, lastweek) => {
    return '/repos/' + owner + '/' + repo + '/collaborators?since=' + lastweek;
};

// Adapted for Backend

// Requires further processing
// See https://developer.github.com/v3/repos/statistics/
// Can also be used to check by week
export const allContributionSum = (owner, repo) => {
    return owner + '/' + repo + '/sum_contribution';
};

export const allCommitsOfRepoForUser = (owner, repo, user) => {
    return owner + '/' + repo + '/commits?user=' + user;
};