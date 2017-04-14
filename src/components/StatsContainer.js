import React from 'react';
import Highcharts from 'highcharts';
import ReactHighcharts from 'react-highcharts'

// Import the components
import ContributionContainer from './ContributionContainer.js';

// Import the Github API calls and presets
import * as api from '../utils/scrape.js';
import * as presets from '../utils/presets.js';
import * as configs from '../utils/chartconfigs.js';

class StatsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updatedModalUser: false,
            modalIsOpen: false,
            modalUser: '',
            allContributionSum: [],
            allCommitsForUser: [],
            configList: [
                {}, {}, {}, {},
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
        });
    }

    componentDidUpdate() {
        if (this.props.submit == 'true') {
            // Reset the submit prop to prevent continuous requerying
            this.props.onDataLoaded();
            // Call the API for sum of contributions
            api.api(presets.allContributionSum(this.props.owner, 
                                               this.props.repo), 
                json => {
                    this.setState({
                        allContributionSum: json,
                        configList: [
                            configs.forCommitsByUser(json),
                            configs.forAdditionsByUser(json),
                            configs.forDeletionsByUser(json),
                            this.state.configList[3],
                        ],
                    });
                    // Remove the class appending display:none and show the data
                    // after the asynchronous call to API
                    const allCards = document.getElementsByClassName('card-stats');
                    for (var i = 0; i < allCards.length; i++) {
                        allCards[i].classList.remove('card-stats');
                    }
                });
        }

        // Call the API for commits per day for user
        // Only make this API call when modalUser has been set
        if (this.state.updatedModalUser) {
            api.api(presets.allCommitsOfRepoForUser(this.props.owner, 
                                                    this.props.repo,
                                                    this.state.modalUser), 
                json => {
                    this.setState({
                        updatedModalUser: false,
                        allCommitsForUser: json,
                        configList: [
                            this.state.configList[0],
                            this.state.configList[1],
                            this.state.configList[2],
                            configs.forCommitHistoryOfUser(json),
                        ],
                    });
                    // Remove the class appending display:none and show the data
                    // after the asynchronous call to API
                    const allCards = document.getElementsByClassName('card-stats');
                    for (var i = 0; i < allCards.length; i++) {
                        allCards[i].classList.remove('card-stats');
                    }
                });
        }
    }

    render() {
        return (
            <ContributionContainer configList={this.state.configList} 
                allContributionSum={this.state.allContributionSum}
                modalIsOpen={this.state.modalIsOpen}
                modalUser={this.state.modalUser}
                toggleModal={this.toggleModal.bind(this)}
                toggleModalAndUser={this.toggleModalAndUser.bind(this)}  />
        );
    }
}

export default StatsContainer;