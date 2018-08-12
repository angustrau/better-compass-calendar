import * as dateMath from 'date-arithmetic';
import * as moment from 'moment';
import * as React from 'react';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import * as api from './../api';
import * as auth from './../auth';
import * as location from './../location';
import * as subscriptions from './../subscriptions';
import * as user from './../user';
import filterToQuery from './../utils/filterToQuery';
import './BCCBigCalendar.css'

BigCalendar.momentLocalizer(moment);

export type View = 'day' | 'week' | 'month';

interface IProps {
    /** The filter to apply. Arbitrary user input */
    filter: string;
    /** The span of time to display */
    view: View;
    /** The date to center on */
    date: Date;
    /** Callback for when a view change is requested */
    onViewChange: (view: View) => void;
    /** Callback for when a date change is requested */
    onDateChange: (date: Date) => void;
    /** Callback for when an event is clicked for more details */
    onEventClick: (event: api.IEventDetails) => void;
}

interface IState {
    /** A list of events to display */
    events: api.IEventDetails[];
}

/**
 * BCCBigCalendar
 * Renders the main calendar display
 */
class BCCBigCalendar extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            events: []
        }

        this.updateEvents = this.updateEvents.bind(this);
    }

    public render() {
        const { view, date, onViewChange, onDateChange, onEventClick } = this.props;
        const { events } = this.state;

        return (
            <div className='BCCBigCalendar-Root'>
                <BigCalendar
                    events={ events }
                    titleAccessor={ (event) => {
                        // Format the title in the form
                        // <title> - <room> - <teacher>
                        const details = [];
                        details.push(event.title);
                        if (event.locationId) {
                            details.push(location.getLocation(event.locationId || 0).shortName);
                        }
                        details.push(user.getManager(event.managerId).displayCode);
                        return details.join(' - ');
                    }}
                    eventPropGetter={ (event: api.IEventDetails, start: Date, end: Date, isSelected: boolean) => {
                        // Add styles for cancelled or changed events
                        return {
                            style: {
                                backgroundColor: event.cancelled ? '#7BADD6' : event.hasChanged ? '#D0585D' : undefined,
                                textDecoration: event.cancelled ? 'line-through' : undefined
                            },
                            className: 'BCCBigCalendar-Event'
                        }
                    }}
                    startAccessor='startTime'
                    endAccessor='endTime'
                    allDayAccessor='allDay'
                    onSelectEvent={ onEventClick }

                    date={ date }
                    view={ view }
                    onNavigate={ (newDate: Date) => onDateChange(newDate) }
                    onView={ (newView: View) => onViewChange(newView) }

                    formats={{
                        dayFormat: 'ddd DD/MM',
                        eventTimeRangeFormat: ((range: { start: Date, end: Date }) => {
                            // Format the event time display to only show the start time in 24 time
                            return range.start.toLocaleString('en-au', { hour12: false, hour: '2-digit', minute: '2-digit'})
                        }) as any
                    }}

                    views={[ 'month', 'week', 'day' ]}
                    drilldownView='day'
                    min={ new Date(0, 0, 0, 8) /* Limit the calendar to 8am */ }
                    max={ new Date(0, 0, 0, 16) /* Limit the calendar to 4pm */ }
                    toolbar={ false }
                    popup={ true }
                />
            </div>
        );
    }

    public componentDidMount() {
        // Listen for event subscription changes
        // Update the shown events when subscriptions change
        subscriptions.events.addEventListener('subscribed', this.updateEvents);
        subscriptions.events.addEventListener('unsubscribed', this.updateEvents);

        this.updateEvents();
    }

    public componentWillUnmount() {
        // Remove subscription update listeners
        subscriptions.events.removeEventListener('subscribed', this.updateEvents);
        subscriptions.events.removeEventListener('unsubscribed', this.updateEvents);
    }

    public async componentDidUpdate(prevProps: IProps) {
        // Check if a change is made that requires new events to be loaded
        if (this.props.filter !== prevProps.filter || this.props.date !== prevProps.date || this.props.view !== prevProps.view) {
            this.updateEvents();
        }
    }

    /**
     * Perform a query and update the events shown
     */
    private async updateEvents() {
        if (auth.isAuthenticated()) {
            const { date, view } = this.props
            // Calculate the start and end dates that are currently being shown
            const viewStart = dateMath.startOf(date, view)
            const viewEnd = dateMath.endOf(date, view)

            // Restrict the query to the current view
            const query = filterToQuery(this.props.filter);
            query.after = dateMath.max(viewStart, query.after || viewStart);
            query.before = dateMath.min(viewEnd, query.before || viewEnd);

            const events = await api.queryEvents(query, auth.getToken()!);
            this.setState({ events });
        }
    }
}

export default BCCBigCalendar;