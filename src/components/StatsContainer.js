import React from 'react';
import Highcharts from 'highcharts';
import ReactHighcharts from 'react-highcharts'

// Import the components
import ContributionContainer from './ContributionContainer.js';
import CommitFileContainer from './CommitFileContainer.js';
import LinesContainer from './LinesContainer.js';

// Import the Github API calls and presets
import * as api from '../utils/scrape.js';
import * as presets from '../utils/presets.js';
import * as configs from '../utils/chartconfigs.js';

class StatsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalStart: '0000-00-00',
            modalEnd: '9999-99-99',

            submittedFileButton: false,
            commitFilepath: '',
            commitFileStart: '',
            commitFileEnd: '',

            updatedModalUser: false,
            updatedModalCompare: false,
            modalIsOpen: false,
            modalUser: '',
            modalCompare: '',

            allLines: [],
            allContributionSum: [],
            allCommitsForUser: [],
            allCommitsForCompare: [],
            allCommitsForFile: [],
            configList: [
                {}, {}, {},
                {
                    // Add a dummy attribute so empty modal can be rendered
                    // Workaround configList[3]
                    xAxis: {
                        categories: [],
                    },
                },
                {
                    // configList[4]
                    // This one stores the config for the actual displayed
                    // graph, configList[3] stores data needed for the full
                    // graph
                    xAxis: {
                        categories: [],
                    },
                },
                {
                    // configList[5]
                    // This one stores the config for the compared user
                    xAxis: {
                        categories: [],
                    },
                },
            ],
        };
    }

    toggleModal() {
        this.setState({
            modalIsOpen: !this.state.modalIsOpen,
            updatedModalUser: false,
        });
    }

    toggleModalAndUser(login) {
        this.setState({
            updatedModalUser: true,
            modalIsOpen: !this.state.modalIsOpen,
            modalUser: login,
            configList: [
                this.state.configList[0],
                this.state.configList[1],
                this.state.configList[2],
                this.state.configList[3],
                configs.headerOnly(),
                this.state.configList[5],
            ],
        });
    }

    submitModalCompare(e) {
        this.setState({
            updatedModalCompare: true,
            modalCompare: e,
            configList: [
                this.state.configList[0],
                this.state.configList[1],
                this.state.configList[2],
                this.state.configList[3],
                configs.headerOnly(),
                this.state.configList[5],
            ],
        });
    }

    submitFileButton() {
        this.setState({
            submittedFileButton: true,
        });
    }

    updateFilepath(e) {
        this.setState({
            commitFilepath: e.target.value,
        });
    }

    updateFileStart(e) {
        this.setState({
            commitFileStart: e.target.value,
        });
    }

    updateFileEnd(e) {
        this.setState({
            commitFileEnd: e.target.value,
        });
    }

    // Elemental formSelect returns selected value as e
    toggleStartDate(e) {
        this.setState({
            modalStart: e,
            configList: [
                this.state.configList[0],
                this.state.configList[1],
                this.state.configList[2],
                this.state.configList[3],
                // Use JSON.parse(JSON.stringify()) to clone the object
                configs.modifyConfig(JSON.parse(JSON.stringify(this.state.configList[3])), e, this.state.modalEnd),
                this.state.configList[5],
            ],
        });
    }

    toggleEndDate(e) {
        this.setState({
            modalEnd: e,
            configList: [
                this.state.configList[0],
                this.state.configList[1],
                this.state.configList[2],
                this.state.configList[3],
                configs.modifyConfig(JSON.parse(JSON.stringify(this.state.configList[3])), this.state.modalStart, e),
                this.state.configList[5],
            ],
        });
    }

    componentDidUpdate() {
        if (this.props.submit == 'true') {
            // Reset the submit prop to prevent continuous requerying
            this.props.onDataLoaded();

            document.getElementById('contribution-container').className = 'loading';
            document.getElementById('commit-file-container').className = 'loading';
            document.getElementById('lines-container').className = 'loading';

            // Call the API for sum of contributions
            api.api(presets.allContributionSum(this.props.owner, 
                                               this.props.repo), 
                json => {
                    console.log('running callback for allContributionSum');
                    this.setState({
                        allContributionSum: json,
                        configList: [
                            configs.forCommitsByUser(json),
                            configs.forAdditionsByUser(json),
                            configs.forDeletionsByUser(json),
                            this.state.configList[3],
                            this.state.configList[4],
                            this.state.configList[5],
                        ],
                    });
                    // Remove the class appending display:none and show the data
                    // after the asynchronous call to API
                    document.getElementById('contribution-container').className = '';
                    document.getElementById('commit-file-container').className = '';

                    //Call the API for lines of repo
                    api.api(presets.allLinesOfRepo(this.props.owner, 
                                                this.props.repo), 
                        json => {
                            console.log('running callback for allLinesOfRepo');
                            this.setState({
                                allLines: json,
                            });
                            // Remove the class appending display:none and show the data
                            // after the asynchronous call to API
                            document.getElementById('lines-container').className = '';
                        },

                        error => {
                            alert(error);
                            document.getElementById('lines-container').className = 'card-stats';
                        });
                },

                error => {
                    alert(error);
                    document.getElementById('contribution-container').className = 'card-stats';
                    document.getElementById('commit-file-container').className = 'card-stats';
                    document.getElementById('lines-container').className = 'card-stats';
                });
        }

        // Call the API for commits per day for user
        // Only make this API call when modalUser has been set
        if (this.state.updatedModalUser) {
            api.api(presets.allCommitsOfRepoForUser(this.props.owner, 
                                                    this.props.repo,
                                                    this.state.modalUser), 
                json => {
                    console.log('running callback for updatedModalUser');
                    this.setState({
                        updatedModalUser: false,
                        allCommitsForUser: json,
                        configList: [
                            this.state.configList[0],
                            this.state.configList[1],
                            this.state.configList[2],
                            configs.forCommitHistoryOfUser(json, this.state.modalUser),
                            configs.forCommitHistoryOfUser(json, this.state.modalUser),
                            this.state.configList[5],
                        ],
                    });
                },

                error => {
                    console.log(error);
                });
        }

        // Call the API for commits per day for comparison
        // Only make this API call when modalUser has been set
        if (this.state.updatedModalCompare) {
            api.api(presets.allCommitsOfRepoForUser(this.props.owner, 
                                                    this.props.repo,
                                                    this.state.modalCompare), 
                json => {
                    console.log('running callback for updatedModalCompare');
                    this.setState({
                        updatedModalCompare: false,
                        allCommitsForCompare: json,
                        configList: [
                            this.state.configList[0],
                            this.state.configList[1],
                            this.state.configList[2],
                            this.state.configList[3],
                            // Generate a combined graph config
                            configs.mergeConfig(JSON.parse(JSON.stringify(this.state.configList[3])), 
                                                configs.forCommitHistoryOfUser(json, this.state.modalCompare)),
                            configs.forCommitHistoryOfUser(json, this.state.modalCompare),
                        ],
                    });
                },

                error => {
                    console.log(error);
                });
        }

        // Call the API for commits for file
        // Only make this API call when submittedFileButton has been set
        if (this.state.submittedFileButton) {
            document.getElementById('commit-file-container').className = 'loading';
            api.api(presets.allCommitsOfFileWithLines(this.props.owner,
                                                      this.props.repo,
                                                      this.state.commitFilepath,
                                                      this.state.commitFileStart,
                                                      this.state.commitFileEnd), 
                json => {
                    document.getElementById('commit-file-container').className = '';
                    console.log('running callback for submittedFileButton');
                    this.setState({
                        submittedFileButton: false,
                        allCommitsForFile: json,
                    });
                },

                error => {
                    document.getElementById('commit-file-container').className = '';
                    alert(error);
                });
        }
    }

    render() {
        return (
            <div>
                <ContributionContainer configList={this.state.configList} 
                    allContributionSum={this.state.allContributionSum}
                    modalIsOpen={this.state.modalIsOpen}
                    modalUser={this.state.modalUser}
                    allCommitsForCompare={this.state.allCommitsForCompare}
                    toggleModal={this.toggleModal.bind(this)}
                    toggleModalAndUser={this.toggleModalAndUser.bind(this)}
                    toggleStartDate={this.toggleStartDate.bind(this)}
                    toggleEndDate={this.toggleEndDate.bind(this)}
                    submitModalCompare={this.submitModalCompare.bind(this)}  />
                <CommitFileContainer allCommitsForFile={this.state.allCommitsForFile} 
                    commitFilepath={this.state.commitFilepath} 
                    commitFileStart={this.state.commitFileStart}
                    commitFileEnd={this.state.commitFileEnd}
                    submitFileButton={this.submitFileButton.bind(this)} 
                    updateFilepath={this.updateFilepath.bind(this)} 
                    updateFileStart={this.updateFileStart.bind(this)}
                    updateFileEnd={this.updateFileEnd.bind(this)} />
                <LinesContainer allLines={this.state.allLines} />
            </div>
        );
    }
}

export default StatsContainer;