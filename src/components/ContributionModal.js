import React from 'react';
import { Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Button, FormSelect } from 'elemental';
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
                    <Row>
                        <Col sm='1/2'>
                            <FormSelect options={this.props.configList[3].xAxis.categories.map(str => ({value: str, label: str}))}
                                firstOption={'Select Start Date'} 
                                onChange={this.props.toggleStartDate} />
                        </Col>
                        <Col sm='1/2'>
                            <FormSelect options={this.props.configList[3].xAxis.categories.map(str => ({value: str, label: str}))} 
                                firstOption={'Select End Date'} 
                                onChange={this.props.toggleEndDate} />
                        </Col>
                    </Row>
                    <ReactHighcharts config={this.props.configList[4]}></ReactHighcharts>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.props.toggleModal}>Close</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default ContributionModal;