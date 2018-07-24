import * as React from 'react';
import {
    Popover,
    PopoverHeader
} from 'reactstrap';
import AutocompleteDatePicker from './AutocompleteDatePicker';
import AutocompleteList, { IAutocompleteListOption } from './AutocompleteList';

interface IProps {
    title: string;
    type: 'list' | 'datepicker';
    options?: IAutocompleteListOption[];
    onDatePick: (value: Date) => void;
    isOpen: boolean;
    target: string;
    toggle: () => void;
}

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