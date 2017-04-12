import React from 'react';
import { PropTypes } from 'react';

import InputBar from './InputBar.js';
import StatsContainer from './StatsContainer.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        // Set the initial state
        this.state = {
            link: "",
            owner: "",
            repo: ""
        };
    }

    updateStateLink(link) {
        console.log('Setting state to: ' + link);
        this.setState({
            link: link
        });
        // This displays wrong values because React's setState
        // method is asynchronous and does not immediately update
        console.log('Current link in state: ' + this.state.link);
    };

    submitRepoLink() {
        // Parse the entered link and extract the owner and
        // the repo name
        const link = this.state.link;
        const owner = link.split('/')[3];
        const repo = link.split('/')[4];
        // Update the state with the owner and repo
        this.setState({
            link: link,
            owner: owner,
            repo: repo
        });
        console.log('owner: ' + owner);
        console.log('repo: ' + repo);
    }

    render() {
        return (
            <div>
                <InputBar link={this.state.link} 
                    onLinkChange={this.updateStateLink.bind(this)} 
                    onLinkSubmit={this.submitRepoLink.bind(this)} />
                
                <StatsContainer owner={this.state.owner}
                    repo={this.state.repo}/>
            </div>
        );
    }
}

export default App;