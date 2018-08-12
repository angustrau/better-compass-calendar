import * as React from 'react';
import {
    ListGroup,
    ListGroupItem
} from 'reactstrap';

/**
 * An option in the autocomplete list
 */
export interface IAutocompleteListOption {
    title: string;
    subtitle: string;
    onClick: () => void;
}

interface IProps {
    /** A list of options to search through */
    options: IAutocompleteListOption[];
}

/**
 * AutocompleteList
 * Renders a list of items for autocomplete
 */
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