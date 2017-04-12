import React from 'react';
import { Card, Form, InputGroup, FormInput, Button, Glyph } from 'elemental';
import '../../node_modules/elemental/less/elemental.less';

class App extends React.Component {
    render() {
        //console.log('rendering');
        return (
            <Card>
                <Form action='visualization.html' method='get'>
                <InputGroup contiguous>
                    <InputGroup.Section grow>
                        <FormInput autoFocus type='text' 
                            placeholder='Enter a repository link '
                            name='repo' />
                    </InputGroup.Section>
                    <InputGroup.Section>
                        <Button submit><Glyph icon='search'/></Button>
                    </InputGroup.Section>
                </InputGroup>
                </Form>
            </Card>
        );
    }
}

export default App;