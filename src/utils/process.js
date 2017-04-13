export const contributionOfTeamMembers = (allTeamMembers, membersWithCommits) => {
    const result = [];
    for (var i = 0; i < allTeamMembers.length; i++) {
        // Create a custom object with no commits as default
        var tmpObj = {
            username: allTeamMembers[i].login,
            commits: '0',
            additions: '0',
            deletions: '0',
        };
        for (var j = 0; j < membersWithCommits.length; j++) {
            if (tmpObj.username == membersWithCommits[i].author.login) {
                // Update results with the obtained values
                tmpObj.commits = membersWithCommits[i].weeks[0].c;
                tmpObj.additions = membersWithCommits[i].weeks[0].a;
                tmpObj.deletions = membersWithCommits[i].weeks[0].d;
                break;
            }
        }
        result.push(tmpObj);
    }
    return result;
};