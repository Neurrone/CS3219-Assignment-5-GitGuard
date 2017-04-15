import React from 'react';
import { Card, Table, Row, Col } from 'elemental';
import Highcharts from 'highcharts';
import ReactHighcharts from 'react-highcharts'
import '../../node_modules/elemental/less/elemental.less';

class ContributionCard extends React.Component {
    render() {
        return (
            <Card className='card-container'>
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
                            <th>Additions</th>
                            <th>Deletions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.allContributionSum.map((obj, i) => {
                            return (
                                <tr key={i}>
                                    <td><a onClick={() => this.props.toggleModalAndUser(obj.login)}>{obj.login}</a></td>
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
                <div className='back-top'>
                    <a href='#top'>To Top</a>
                </div>
            </Card>
        );
    }
}

export default ContributionCard;