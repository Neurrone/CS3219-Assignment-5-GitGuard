import React from 'react';

import LinesCard from './LinesCard.js';

class LinesContainer extends React.Component {
    render() {
        return (
            <div className='card-stats' id='lines-container'>
                <LinesCard allLines={this.props.allLines}/>
            </div>
        );
    }
}

export default LinesContainer;