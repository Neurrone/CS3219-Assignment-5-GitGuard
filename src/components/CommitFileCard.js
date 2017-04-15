import React from 'react';
import { Card, Table, Row, Col, FormInput, Button } from 'elemental';
import '../../node_modules/elemental/less/elemental.less';

class CommitFileCard extends React.Component {
    render() {
        return (
            <Card className='card-container'>
                <h3>Commits Per File</h3>
                <br/>
                <Row>
                    <Col sm='6/10'>
                        <FormInput placeholder='Enter File Path' onChange={this.props.updateFilepath} />
                    </Col>
                    <Col sm='1/9'>
                        <FormInput placeholder='Start' onChange={this.props.updateFileStart} />
                    </Col>
                    <Col sm='1/9'>
                        <FormInput placeholder='End' onChange={this.props.updateFileEnd} />
                    </Col>
                    <Col sm='1/10'>
                        <Button className='commit-file' 
                            onClick={this.props.submitFileButton}>
                            Get Commits
                        </Button>
                    </Col>
                </Row>
                <br/>
                <Table>
                    <colgroup>
                        <col width='10%' />
                        <col width='20%' />
                        <col width='25%' />
                        <col width='40%' />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>Author</th>
                            <th>Date</th>
                            <th>Hash</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.allCommitsForFile.map((obj, i) => {
                            return (
                                <tr key={i}>
                                    <td>{obj.author.split('<')[0]}</td>
                                    <td>{obj.date}</td>
                                    <td>{obj.hash}</td>
                                    <td>{obj.message}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
                <br/>
                <div className='back-top'>
                    <a href='#top'>To Top</a>
                </div>
            </Card>
        );
    }
}

export default CommitFileCard;