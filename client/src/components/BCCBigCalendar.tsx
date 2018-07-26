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
import BCCEventDetailModal from './BCCEventDetailModal';

BigCalendar.momentLocalizer(moment);

export type View = 'day' | 'week' | 'month';

interface IProps {
    filter: string;
    view: View;
    date: Date;
    onViewChange: (view: View) => void;
    onDateChange: (date: Date) => void;
}

interface IState {
    events: api.IEventDetails[];
    showingEventDetails: api.IEventDetails | null;
}

class BCCBigCalendar extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            events: [],
            showingEventDetails: null
        }

        this.handleSubscriptionUpdate = this.handleSubscriptionUpdate.bind(this);
        this.handleSelectEvent = this.handleSelectEvent.bind(this);
        this.handleCloseEventModal = this.handleCloseEventModal.bind(this);
    }

    public render() {
        const { view, date, onViewChange, onDateChange } = this.props;
        const { events, showingEventDetails } = this.state;

        return (
            <div className='BCCBigCalendar-Root'>
                <BigCalendar
                    events={ events }
                    titleAccessor={ (event) => {
                        const details = [];
                        details.push(event.title);
                        if (event.locationId) {
                            details.push(location.getLocation(event.locationId || 0).shortName);
                        }
                        details.push(user.getManager(event.managerId).displayCode);
                        return details.join(' - ');
                    }}
                    eventPropGetter={ (event: api.IEventDetails, start: Date, end: Date, isSelected: boolean) => {
                        return {
                            style: {
                                backgroundColor: event.cancelled ? '#7BADD6' : undefined,
                                textDecoration: event.cancelled ? 'line-through' : undefined
                            }
                        }
                    }}
                    startAccessor='startTime'
                    endAccessor='endTime'
                    allDayAccessor='allDay'
                    onSelectEvent={ this.handleSelectEvent }

                    date={ date }
                    view={ view }
                    onNavigate={ (newDate: Date) => onDateChange(newDate) }
                    onView={ (newView: View) => onViewChange(newView) }

                    formats={{
                        dayFormat: 'ddd DD/MM',
                        eventTimeRangeFormat: ((range: { start: Date, end: Date }) => range.start.toLocaleString('en-au', { hour12: false,hour:'2-digit',minute:'2-digit'})) as any
                    }}

                    views={[ 'month', 'week', 'day' ]}
                    drilldownView='day'
                    min={ new Date(0, 0, 0, 8) }
                    max={ new Date(0, 0, 0, 16) }
                    toolbar={ false }
                    popup={ true }
                />
                <BCCEventDetailModal
                    isOpen={ showingEventDetails !== null }
                    event={ showingEventDetails! }
                    onClose={ this.handleCloseEventModal }
                />
            </div>
        );
    }

    public componentDidMount() {
        subscriptions.events.addEventListener('subscribed', this.handleSubscriptionUpdate);
        subscriptions.events.addEventListener('unsubscribed', this.handleSubscriptionUpdate);

        this.updateEvents();
    }

    public componentWillUnmount() {
        subscriptions.events.removeEventListener('subscribed', this.handleSubscriptionUpdate);
        subscriptions.events.removeEventListener('unsubscribed', this.handleSubscriptionUpdate);
    }

    public async componentDidUpdate(prevProps: IProps) {
        if (this.props.filter !== prevProps.filter || this.props.date !== prevProps.date || this.props.view !== prevProps.view) {
            this.updateEvents();
        }
    }

    private async updateEvents() {
        if (auth.isAuthenticated()) {
            const { date, view } = this.props
            const viewStart = dateMath.subtract(dateMath.startOf(date, view), 0, view);
            const viewEnd = dateMath.add(dateMath.endOf(date, view), 0, view);

            const query = filterToQuery(this.props.filter);
            query.after = dateMath.max(viewStart, query.after || viewStart);
            query.before = dateMath.min(viewEnd, query.before || viewEnd);

            const events = await api.queryEvents(query, auth.getToken()!);
            this.setState({ events });
        }
    }

    private handleSubscriptionUpdate() {
        this.updateEvents();
    }

    private handleSelectEvent(event: api.IEventDetails, e: React.SyntheticEvent) {
        this.setState({ showingEventDetails: event });
    }

    private handleCloseEventModal() {
        this.setState({ showingEventDetails: null });
    }
}

export default BCCBigCalendar;