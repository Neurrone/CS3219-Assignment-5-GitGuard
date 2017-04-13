import React from 'react';
import { Card, Table, Glyph } from 'elemental';
import '../../node_modules/elemental/less/elemental.less';

// Import the Github API calls and presets
import * as api from '../utils/scrape.js';
import * as presets from '../utils/presets.js';

class StatsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            results: [],
        };
    }

    componentDidUpdate() {
        if (this.props.submit == 'true') {
            // Reset the submit prop to prevent continuous requerying
            this.props.onDataLoaded();
            // Call the APIs
            api.api(presets.allInsDelOfRepo(this.props.owner, 
                                            this.props.repo), 
                json => {
                    this.setState({
                        results: json,
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
                                        <td>{obj.author.login}</td>
                                        <td>{obj.weeks[0].c}</td>
                                        <td>{obj.weeks[0].a}</td>
                                        <td>{obj.weeks[0].d}</td>
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