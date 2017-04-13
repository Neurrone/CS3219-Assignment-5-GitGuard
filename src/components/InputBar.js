import React from 'react';
import { Redirect } from 'react-router';
import { Card, Form, InputGroup, FormInput, Button, Glyph } from 'elemental';
import '../../node_modules/elemental/less/elemental.less';

class SearchPage extends React.Component {
    constructor(props) {
        super(props);
    }

    updateStateLink(e) {
        this.props.onLinkChange(
            e.target.value
        );
    };

    submitRepoLink(e) {
        e.preventDefault();
        this.props.onLinkSubmit();
    }

    render() {
        return (
            <Card id='card-container'>
                <Form onSubmit={this.submitRepoLink.bind(this)} >
                <InputGroup contiguous>
                    <InputGroup.Section grow>
                        <FormInput autoFocus type='text' 
                            placeholder='Enter a repository link '
                            name='repo'
                            value={this.props.link}
                            onChange={this.updateStateLink.bind(this)} />
                    </InputGroup.Section>
                    <InputGroup.Section>
                        <Button onClick={this.submitRepoLink.bind(this)}><Glyph icon='search'/></Button>
                    </InputGroup.Section>
                </InputGroup>
                </Form>
            </Card>
        );
    }
}

export default SearchPage;