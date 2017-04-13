import React from 'react';
import { Card, Table, Glyph } from 'elemental';
import '../../node_modules/elemental/less/elemental.less';

// Import the Github API calls and presets
import * as api from '../utils/scrape.js';
import * as presets from '../utils/presets.js';
import * as process from '../utils/process.js';

class StatsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allTeamMembers: [],
            teamMembersWithCommits: [],
            results: [],
        };
    }

    componentDidUpdate() {
        if (this.props.submit == 'true') {
            // Reset the submit prop to prevent continuous requerying
            this.props.onDataLoaded();
            // Call the APIs
            // api.api(presets.allInsDelOfRepo(this.props.owner, 
            //                             this.props.repo), 
            //     json => {
            //         this.setState({
            //             teamMembersWithCommits: json,
            //         });
            //     });

            // api.api(presets.allCollaboratorsOfRepo(this.props.owner, 
            //                                    this.props.repo), 
            //     json => {
            //         this.setState({
            //             allTeamMembers: json,
            //         });
            //     });

            api.apiTwoPaths(presets.allCollaboratorsOfRepo(this.props.owner, this.props.repo), 
                            presets.allInsDelOfRepo(this.props.owner, this.props.repo), 
                (json1, json2) => {
                    this.setState({
                        results: process.contributionOfTeamMembers(json1, json2),
                    });
                });
        }
    }

    render() {
        return (
            <Card id='card-container'>
                <div>
                    <Table>
                        <colgroup>
                            <col width='55%' />
                            <col width='15%' />
                            <col width='15%' />
                            <col width='15%' />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Commits</th>
                                <th>Insertions</th>
                                <th>Deletions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.results.map((obj) => {
                                return (
                                    <tr>
                                        <td>{obj.username}</td>
                                        <td>{obj.commits}</td>
                                        <td>{obj.additions}</td>
                                        <td>{obj.deletions}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
            </Card>
        );
    }
}

export default StatsContainer;

/*// Return a Table component
                        console.log(collaborators[0]);
                        return (
                            <Table>
                                <colgroup>
                                    <col width='40%' />
                                    <col width='20%' />
                                    <col width='20%' />
                                    <col width='20%' />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th>Username</th>
                                        <th>Commits</th>
                                        <th>Insertions</th>
                                        <th>Deletions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {collaborators.map((obj) => {
                                        return (
                                            <tr>
                                                <td>{obj.login}</td>
                                                <td>{obj.id}</td>
                                                <td>{obj.type}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        );*/