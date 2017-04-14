import React from 'react';
import { Card, Table, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'elemental';
import Highcharts from 'highcharts';
import ReactHighcharts from 'react-highcharts'
import '../../node_modules/elemental/less/elemental.less';

class ContributionModal extends React.Component {
    render() {
        return (
            <Modal isOpen={this.props.modalIsOpen} 
                onCancel={this.props.toggleModal} width='large'>
                <ModalHeader text='Commit History' showCloseButton onClose={this.props.toggleModal} />
                <ModalBody>
                    <ReactHighcharts config={this.props.configList[3]}></ReactHighcharts>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.props.toggleModal}>Close</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default ContributionModal;