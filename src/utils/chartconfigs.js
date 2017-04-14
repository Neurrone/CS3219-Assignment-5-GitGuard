import Highcharts from 'highcharts';
import ReactHighcharts from 'react-highcharts'

// DATE COMPARISON FUNCTIONS
// Input: YYYY-MM-DD

// Returns true if date1 is later or equal to date2
export const isLaterThan = (date1, date2) => {
    // Convert to integers
    const date1Int = parseInt(date1.substr(0, 4) + date1.substr(5, 2) + date1.substr(8, 2));
    const date2Int = parseInt(date2.substr(0, 4) + date2.substr(5, 2) + date2.substr(8, 2));
    return date1Int >= date2Int;
}

// Returns true if date1 is earlier or equal to date2
export const isEarlierThan = (date1, date2) => {
    // Convert to integers
    const date1Int = parseInt(date1.substr(0, 4) + date1.substr(5, 2) + date1.substr(8, 2));
    const date2Int = parseInt(date2.substr(0, 4) + date2.substr(5, 2) + date2.substr(8, 2));
    return date1Int <= date2Int;
}

export const forCommitsByUser = (json) => {
    return {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
        },
        title: {
            text: 'Commits',
            margin: 15,
        },
        tooltip: {
            pointFormat: '<b>Commits: {point.y}</b>',
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false,
                    format: '<b>{point.name}: {point.y}</b>',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                    },
                },
            },
        },
        series: [{
            name: 'Users',
            colorByPoint: true,
            data: json.map((obj) => {
                return {
                    name: obj.login,
                    y: obj.commits,
                };
            }),
        }],
    };
}

export const forAdditionsByUser = (json) => {
    return {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
        },
        title: {
            text: 'Additions',
            margin: 15,
        },
        tooltip: {
            pointFormat: '<b>Additions: {point.y}</b>',
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false,
                    format: '<b>{point.name}: {point.y}</b>',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                    },
                },
            },
        },
        series: [{
            name: 'Users',
            colorByPoint: true,
            data: json.map((obj) => {
                return {
                    name: obj.login,
                    y: obj.additions,
                };
            }),
        }],
    };
}

export const forDeletionsByUser = (json) => {
    return {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
        },
        title: {
            text: 'Deletions',
            margin: 15,
        },
        tooltip: {
            pointFormat: '<b>Deletions: {point.y}</b>',
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false,
                    format: '<b>{point.name}: {point.y}</b>',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                    },
                },
            },
        },
        series: [{
            name: 'Users',
            colorByPoint: true,
            data: json.map((obj) => {
                return {
                    name: obj.login,
                    y: obj.deletions,
                };
            }),
        }],
    };
}

export const forCommitHistoryOfUser = (json, user) => {
    return {
        title: {
            text: 'User Commit History',
        },
        subtitle: {
            text: 'Commits per day',
        },
        yAxis: {
            title: {
                text: 'Commits'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        xAxis: {
            categories: json.map((obj) => {
                return obj.date;
            }).reverse(),
        },
        series: [
            {
                name: user,
                data: json.map((obj) => {
                    return obj.count;
                }).reverse(),
            },
        ]
    };
}

export const modifyConfig = (config, start, end) => {
    // Update x-axis
    var newCategories = [];
    var newData = [];
    for (var i = 0; i < config.xAxis.categories.length; i++) {
        if (isLaterThan(config.xAxis.categories[i], start) && 
            isEarlierThan(config.xAxis.categories[i], end)) {
            newCategories.push(config.xAxis.categories[i]);
            newData.push(config.series[0].data[i]);
        }
    }
    config.xAxis.categories = newCategories;
    config.series[0].data = newData;

    return config;
}

export const mergeConfig = (config1, config2) => {

    // Update x-axis
    var newCategories = [];
    var newData1 = [];
    var newData2 = [];
    var len1 = config1.xAxis.categories.length;
    var len2 = config2.xAxis.categories.length;
    var itr1 = 0; 
    var itr2 = 0;
    
    // Merging algorithm
    while (itr1 < len1 && itr2 < len2) {
        if (config1.xAxis.categories[itr1] == config2.xAxis.categories[itr2]) {
            newCategories.push(config1.xAxis.categories[itr1]);
            newData1.push(config1.series[0].data[itr1]);
            newData2.push(config2.series[0].data[itr2]);
            itr1++;
            itr2++;
        } else if (isEarlierThan(config1.xAxis.categories[itr1], config2.xAxis.categories[itr2])) {
            newCategories.push(config1.xAxis.categories[itr1]);
            newData1.push(config1.series[0].data[itr1]);
            newData2.push(0);
            itr1++;
        } else {
            newCategories.push(config2.xAxis.categories[itr2]);
            newData1.push(0);
            newData2.push(config2.series[0].data[itr2]);
            itr2++;
        }
    }
    //console.log(newData1);

    while (itr1 < len1) {
        newCategories.push(config1.xAxis.categories[itr1]);
        newData1.push(config1.series[0].data[itr1]);
        newData2.push(0);
        itr1++;
    }
    while (itr2 < len2) {
        newCategories.push(config2.xAxis.categories[itr2]);
        newData1.push(0);
        newData2.push(config2.series[0].data[itr2]);
        itr2++;
    }

    var name1 = config1.series[0].name;
    var name2 = config2.series[0].name;

    config1.xAxis.categories = newCategories;
    config1.series = [
        {
            name: name1,
            data: newData1,
        },
        {
            name: name2,
            data: newData2,
        },
    ];

    //console.log(config1);
    return config1;
}