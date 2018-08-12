import * as React from 'react';
import {
    Input
} from 'reactstrap';
import * as location from '../location';
import * as user from '../user';
import { IAutocompleteListOption } from './AutocompleteList';
import AutocompletePopover from './AutocompletePopover';

let idCount = 0;

interface IProps {
    /** The current filter */
    filter: string;
    /** Callback for when the filter changes */
    onChange: (filter: string) => void;
    /** Whether this is a "filter" or "search" box */
    search?: boolean;
    /** Extra CSS classes to apply */
    className?: string;
}

interface IState {
    /** Whether the autocomplete dialog is open */
    autocompleteOpen: boolean;
}

/**
 * BCCFilterBox
 * Renders an input box for filters with autocomplete
 */
class BCCFilterBox extends React.Component<IProps, IState> {
    private inputRef: HTMLInputElement;
    private inputID: string;

    constructor(props: IProps) {
        super(props);

        this.state = {
            autocompleteOpen: false
        }

        // Generate a unique ID for this component
        this.inputID = 'BCCFilterBox-Input' + idCount.toString();
        idCount++;

        this.autocompleteDefault = this.autocompleteDefault.bind(this);
        this.autocompleteTeacher = this.autocompleteTeacher.bind(this);
        this.autocompleteRoom = this.autocompleteRoom.bind(this);
        this.appendWord = this.appendWord.bind(this);
        this.onNewFilter = this.onNewFilter.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputFocus = this.handleInputFocus.bind(this);
        this.handleInputRef = this.handleInputRef.bind(this);
        this.handleAutocompleteClose = this.handleAutocompleteClose.bind(this);
    }

    public render() {
        // Split the current filter in to tokens
        const tokens = this.props.filter.split(' ')
        const lastToken = tokens[tokens.length - 1].split(':');

        // Set to show a list of possible autocomplete options
        let autocompleteOptions: IAutocompleteListOption[] | undefined;
        // Set to show a date picker
        let autocompleteToken: string;
        if (lastToken.length !== 2) {
            // Ensure last token contains semicolon
            // If not render the default options
            autocompleteOptions = this.autocompleteDefault(lastToken[0]);
        } else {
            // The user has entered '<token>:', show specific autocomplete options
            switch(lastToken[0]) {
                case 'before':
                    autocompleteToken = 'before:';
                    break;
                case 'after':
                    autocompleteToken = 'after:';
                    break;
                case 'during':
                    autocompleteToken = 'during:';
                    break;
                case 'title':
                    autocompleteOptions = this.autocompleteDefault();
                    break;
                case 'teacher':
                    autocompleteOptions = this.autocompleteTeacher(lastToken[1]);
                    break;
                case 'room':
                    autocompleteOptions = this.autocompleteRoom(lastToken[1]);
                    break;
                default:
                    autocompleteOptions = this.autocompleteDefault();
                    break;
            }
        }

        return (
            <div className={ 'BCCFilterBox-Root ' + this.props.className || '' }>
                <Input 
                    value={this.props.filter} 
                    onChange={this.handleInputChange}
                    onFocus={this.handleInputFocus} 
                    innerRef={this.handleInputRef}
                    id={ this.inputID }
                />
                <AutocompletePopover
                    title={ (this.props.search ? 'Search' : 'Filter') + ' Options' }
                    type={ autocompleteOptions ? 'list' : 'datepicker' }
                    options={ autocompleteOptions }
                    onDatePick={v => {
                        // When a date is chosen in the autocomplete, add it to the filter
                        this.appendWord(`${autocompleteToken}${v.getFullYear()}-${v.getMonth()+1}-${v.getDate()} `)
                    }}
                    isOpen={ this.state.autocompleteOpen }
                    target={ this.inputID }
                    toggle={ this.handleAutocompleteClose }
                />
            </div>
        )
    }

    /**
     * Get a list of autocomplete options to use as default
     */
    private autocompleteDefault(currentValue = '') {
        const options = [
            ['title:', 'text'],
            ['before:', 'date'],
            ['after:', 'date'],
            ['during:', 'date'],
            ['teacher:', 'person'],
            ['room:', 'location'],
            ['subscribed', '']
        ];
        const relevantOptions = options.filter((option) => {
            return option[0].indexOf(currentValue) !== -1;
        })
        .map(([filter, type]) => {
            return {
                title: filter,
                subtitle: type,
                onClick: () => this.appendWord(filter, currentValue !== '')
            }
        });

        return relevantOptions;
    }

    /**
     * Get a list of teachers to autocomplete
     */
    private autocompleteTeacher(currentValue = '') {
        const v = currentValue.toLowerCase();
        const managers = user.getAllManagers();
        // Find all managers that match the keyword
        const relevantManagers = managers.filter((m, i) => {
            return m.fullName.toLowerCase().indexOf(v) !== -1 || m.displayCode.toLowerCase().indexOf(v) !== -1;
        })
        .sort((a, b) => a.displayCode < b.displayCode ? -1 : 1)
        .slice(0, 5)
        .map(m => {
            return {
                title: m.displayCode,
                subtitle: m.fullName,
                onClick: () => this.appendWord('teacher:' + m.displayCode + ' ')
            }
        });
        
        return relevantManagers;
    }

    /**
     * Get a list of rooms to autocomplete
     */
    private autocompleteRoom(currentValue = '') {
        const v = currentValue.toLowerCase();
        const locations = location.getAllLocations();
        // Find all the locations that match the keyword
        const relevantLocations = locations.filter((l, i) => {
            return l.fullName.toLowerCase().indexOf(v) !== -1 || l.shortName.toLowerCase().indexOf(v) !== -1;
        })
        .sort((a, b) => a.shortName < b.shortName ? -1 : 1)
        .slice(0, 5)
        .map(l => {
            return {
                title: l.shortName,
                subtitle: l.fullName,
                onClick: () => this.appendWord('room:' + l.shortName + ' ')
            }
        });
        
        return relevantLocations;
    }

    /**
     * Autocomplete a word
     */
    private appendWord(word: string, replace: boolean = true) {
        // Make sure the input box is focused after autocomplete is clicked
        this.inputRef.focus();
        
        // Build the new filter
        const words = this.props.filter.trim().split(' ');
        if (replace || words[0] === '') {
            words.pop();
        }
        words.push(word);
        this.onNewFilter(words.join(' '));
    }

    private onNewFilter(filter: string) {
        this.props.onChange(filter);
    }

    private handleInputChange(event: React.FormEvent<HTMLInputElement>) {
        this.onNewFilter(event.currentTarget.value);
    }

    private handleInputFocus() {
        this.setState({ autocompleteOpen: true });
    }

    private handleInputRef(ref: HTMLInputElement) {
        this.inputRef = ref;
    }

    private handleAutocompleteClose() {
        this.setState({ autocompleteOpen: false });
    }
}

export default BCCFilterBox;