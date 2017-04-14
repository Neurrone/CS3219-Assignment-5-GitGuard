import React from 'react';
import { Card, Glyph } from 'elemental';
import '../../node_modules/elemental/less/elemental.less';

class LandingCard extends React.Component {
    render() {
        return (
            <Card className='card-container'>
                <h2>CS3219 Assignment 5: GIT-Guard</h2>
                <Glyph icon='mark-github' />
                <span> A Github Visualization Tool based off GIT-Inspector.</span>
            </Card>
        );
    }
};

export default LandingCard;