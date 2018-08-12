import * as React from 'react';
import Calendar from 'react-calendar';

interface IProps {
    /** Function to call when a date is picked */
    onChange: (value: Date) => void;
}
/**
 * AutocompleteDatePicker
 * Renders a date picker for autocomplete
 */
class AutocompleteDatePicker extends React.Component<IProps, object> {
    public render() {
        const { onChange } = this.props;
        // Calculate the first and last date of the current year
        // Limits the date the user can select to the current year
        const date = new Date();
        const yearStart = new Date(date.getFullYear(), 0, 1);
        const yearEnd = new Date(date.getFullYear(), 11, 31);

        return (
            <Calendar
                minDate={ yearStart }
                maxDate={ yearEnd }
                minDetail='month'
                maxDetail='month'
                onChange={ onChange }
            />
        );
    }
}

export default AutocompleteDatePicker;