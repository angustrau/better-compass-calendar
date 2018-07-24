import * as React from 'react';
import Calendar from 'react-calendar';

interface IProps {
    onChange: (value: Date) => void;
}

class AutocompleteDatePicker extends React.Component<IProps, object> {
    public render() {
        const { onChange } = this.props;
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