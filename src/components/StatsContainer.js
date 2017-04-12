import React from 'react';
import { Card, Glyph } from 'elemental';
import '../../node_modules/elemental/less/elemental.less';

class StatsContainer extends React.Component {
    render() {
        return (
            <Card id='card-container'>
                <div>{this.props.owner}</div>
                <div>{this.props.repo}</div>
            </Card>
        );
    }
}

export default StatsContainer;