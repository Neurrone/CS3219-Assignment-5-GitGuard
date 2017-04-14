import React from 'react';

// Import subcomponents
import ContributionCard from './ContributionCard.js';
import ContributionModal from './ContributionModal.js';

class ContributionContainer extends React.Component {
    render() {
        return (
            <div className='card-stats'>
                <ContributionCard allContributionSum={this.props.allContributionSum}
                    toggleModalAndUser={this.props.toggleModalAndUser}
                    configList={this.props.configList} />
                <ContributionModal modalIsOpen={this.props.modalIsOpen}
                    toggleModal={this.props.toggleModal}
                    configList={this.props.configList}
                    toggleStartDate={this.props.toggleStartDate}
                    toggleEndDate={this.props.toggleEndDate} />
            </div>
        );
    }
}

export default ContributionContainer;