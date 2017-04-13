import Highcharts from 'highcharts';
import ReactHighcharts from 'react-highcharts'

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
            }),
        },
        series: [
            {
                name: 'Commits',
                data: json.map((obj) => {
                    return obj.count;
                }),
            },
        ]
    };
}