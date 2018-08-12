import * as React from 'react';
import {
    Popover,
    PopoverHeader
} from 'reactstrap';
import AutocompleteDatePicker from './AutocompleteDatePicker';
import AutocompleteList, { IAutocompleteListOption } from './AutocompleteList';

interface IProps {
    /** String shown in the header */
    title: string;
    /** Whether to have a searchable-list or a date picker */
    type: 'list' | 'datepicker';
    /** The options to choose from, if this is a list autocomplete */
    options?: IAutocompleteListOption[];
    /** A callback for when a date is chosen, if this is a date picker */
    onDatePick: (value: Date) => void;
    /** Whether the popup is currently shown */
    isOpen: boolean;
    /** A DOM element ID to attach the popup to */
    target: string;
    /** A callback to close the popup */
    toggle: () => void;
}

/**
 * AutocompletePopover
 * Renders a popup with autocomplete information
 */
class AutocompletePopover extends React.Component<IProps,object> {
    public render() {
        const { title, type, options, onDatePick, isOpen, target, toggle } = this.props;

        return (
            <Popover
                isOpen={ isOpen }
                target={ target }
                toggle={ toggle }
                placement='bottom-start'
            >
                <PopoverHeader>{ title }</PopoverHeader>
                {
                    type === 'list' ? <AutocompleteList options={ options || [] } />
                    : type === 'datepicker' ? <AutocompleteDatePicker onChange={ onDatePick } />
                    : null
                }
            </Popover>
        );
    }
}

export default AutocompletePopover;