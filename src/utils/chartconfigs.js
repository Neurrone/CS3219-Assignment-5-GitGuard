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

export const forCommitHistoryOfUser = (json) => {
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
                name: 'Commits',
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