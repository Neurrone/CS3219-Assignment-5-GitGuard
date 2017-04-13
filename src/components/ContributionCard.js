import React from 'react';
import { Card, Table, Row, Col } from 'elemental';
import Highcharts from 'highcharts';
import ReactHighcharts from 'react-highcharts'
import '../../node_modules/elemental/less/elemental.less';

class ContributionCard extends React.Component {
    render() {
        return (
            <div className='card-stats'>
                <Card id='card-container'>
                    <h3>Contributor Data</h3>
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
                            {this.props.results.map((obj, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{obj.login}</td>
                                        <td>{obj.commits}</td>
                                        <td>{obj.additions}</td>
                                        <td>{obj.deletions}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                    <br/>
                    <h3>Visualization</h3>
                    <br/>
                    <Row>
                        <Col sm='1/3'>
                            <Card><ReactHighcharts config={this.props.configList[0]}></ReactHighcharts></Card>
                        </Col>
                        <Col sm='1/3'>
                            <Card><ReactHighcharts config={this.props.configList[1]}></ReactHighcharts></Card>
                        </Col>
                        <Col sm='1/3'>
                            <Card><ReactHighcharts config={this.props.configList[2]}></ReactHighcharts></Card>
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    }
}

export default ContributionCard;