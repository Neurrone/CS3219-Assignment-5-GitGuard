import React from 'react';

import CommitFileCard from './CommitFileCard.js';

class CommitFileContainer extends React.Component {
    render() {
        return (
            <div className='card-stats' id='commit-file-container'>
                <CommitFileCard allCommitsForFile={this.props.allCommitsForFile} 
                    submitFileButton={this.props.submitFileButton}
                    commitFilepath={this.props.commitFilepath} 
                    commitFileStart={this.props.commitFileStart}
                    commitFileEnd={this.props.commitFileEnd}
                    updateFilepath={this.props.updateFilepath} 
                    updateFileStart={this.props.updateFileStart}
                    updateFileEnd={this.props.updateFileEnd} />
            </div>
        );
    }
}

export default CommitFileContainer;