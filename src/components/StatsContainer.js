import React from 'react';
import Highcharts from 'highcharts';
import ReactHighcharts from 'react-highcharts'

// Import the components
import ContributionCard from './ContributionCard.js';

// Import the Github API calls and presets
import * as api from '../utils/scrape.js';
import * as presets from '../utils/presets.js';
import * as configs from '../utils/chartconfigs.js';

class StatsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
            configList: [{}, {}, {}],
        };
    }

    componentDidUpdate() {
        if (this.props.submit == 'true') {
            // Reset the submit prop to prevent continuous requerying
            this.props.onDataLoaded();
            // Call the APIs
            api.api(presets.allContributionSum(this.props.owner, 
                                               this.props.repo), 
                json => {
                    this.setState({
                        results: json,
                        configList: [
                            configs.forCommitsByUser(json),
                            configs.forAdditionsByUser(json),
                            configs.forDeletionsByUser(json),
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
            <ContributionCard configList={this.state.configList} results={this.state.results} />
        );
    }
}

export default StatsContainer;