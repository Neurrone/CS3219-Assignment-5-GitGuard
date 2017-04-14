import React from 'react';
import { Card, Table, Row, Col } from 'elemental';
import '../../node_modules/elemental/less/elemental.less';

class LinesCard extends React.Component {
    render() {
        return (
            <Card className='card-container'>
                <h3>Lines Of Code</h3>
                <Table>
                    <colgroup>
                        <col width='50%' />
                        <col width='50%' />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Lines of code</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.allLines.map((obj, i) => {
                            return (
                                <tr key={i}>
                                    <td>{obj.name}</td>
                                    <td>{obj.count}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
                <br/>
                <div className='back-top'>
                    <a href='#card-input'>To Top</a>
                </div>
            </Card>
        );
    }
}

export default LinesCard;