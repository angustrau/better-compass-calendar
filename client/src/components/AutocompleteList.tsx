import * as React from 'react';
import {
    ListGroup,
    ListGroupItem
} from 'reactstrap';

export interface IAutocompleteListOption {
    title: string;
    subtitle: string;
    onClick: () => void;
}

interface IProps {
    options: IAutocompleteListOption[];
}

class AutocompleteList extends React.Component<IProps, object> {
    public render() {
        const { options } = this.props;

        return (
            <ListGroup flush={true}>
                { options.map(({ title, subtitle, onClick }, key) => {
                    return (
                        <ListGroupItem 
                            action={true} 
                            tag='button' 
                            onClick={onClick}
                            key={key}
                        >
                            <b>{ title }</b> { subtitle }
                        </ListGroupItem>
                    );
                }) }
            </ListGroup>
        );
    }
}

export default AutocompleteList;