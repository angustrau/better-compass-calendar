import * as React from 'react';
import { 
    RouteComponentProps, 
    withRouter 
} from 'react-router-dom';
import {
    Button,
    Col,
    Container,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row
} from 'reactstrap';
import { IEventDetails } from '../api';
import { getToken, isAuthenticated } from '../auth';
import * as location from '../location';
import * as subscriptions from '../subscriptions';
import * as user from '../user';
import * as api from './../api';
import './BCCEventDetailModal.css';

/**
 * Render a row of the details
 */
const DataDisplay = (props: { icon: string, children?: React.ReactNode }) => {
    return (
        <Row>
            <Col xs='2'>
                <div className='BCCEventDetailModal-InfoIcon'>
                    <span className='material-icons'>{ props.icon }</span>
                </div>
            </Col>
            <Col>
                { props.children }
            </Col>
        </Row>
    )
}

interface IProps extends RouteComponentProps<{}> {
    /** The ID of the event to show details of */
    eventId: string | null;
    /** Whether the dialog is open */
    isOpen: boolean;
    /** Callback to close the dialog */
    onClose: () => void;
    /** Add a direct link to this event info page  */
    permalink?: boolean;
}

interface IState {
    /** Whether the user is subscribed to this activity */
    subscribed: boolean;
    /** The details of this event */
    event: IEventDetails | null;
}

/**
 * BCCEventDetailModal
 * Renders the popup with event details
 */
class BCCEventDetailModal extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            subscribed: false,
            event: null
        }

        if (this.props.eventId) {
            // Fetch event details and subscription status
            api.getEventDetails(this.props.eventId, getToken()!)
            .then((event) => {
                this.setState({ subscribed: subscriptions.isSubscribed(event.activityId), event });
            });
        }

        this.toggleSubscription = this.toggleSubscription.bind(this);
        this.handlePermalinkClick = this.handlePermalinkClick.bind(this);
    }

    public render() {
        const { isOpen, onClose, permalink } = this.props;
        const { subscribed, event } = this.state;

        // Check if event details have loaded
        if (!event) {
            return <div />
        }

        // Format time as strings
        const date = event.startTime.toLocaleString('en-au', { weekday: 'long', day: '2-digit', month: 'long' });
        const startTime = event.startTime.toLocaleString('en-au', { hour: '2-digit', minute: '2-digit' });
        const endTime = event.endTime.toLocaleString('en-au', { hour: '2-digit', minute: '2-digit' });

        return (
            <Modal isOpen={ isOpen } toggle={ onClose }>
                <ModalHeader tag='div' className='BCCEventDetailModal-Header'>
                    <h4>{ event.title }</h4>
                    <span
                        className='BCCEventDetailModal-Subscribed btn material-icons'
                        onClick={ this.toggleSubscription }
                    >
                        { subscribed ? 'notifications_active' : 'notifications_off' }
                    </span>
                </ModalHeader>
                <ModalBody>
                    <Container className='BCCEventDetailModal-Body'>
                        <DataDisplay icon='access_time'>
                            { date }
                            <br />
                            { `${startTime} – ${endTime}` }
                        </DataDisplay>
                        <DataDisplay icon='location_on'>
                            { location.getLocation(event.locationId || 0).fullName }
                        </DataDisplay>
                        <DataDisplay icon='supervisor_account'>
                            { user.getManager(event.managerId).fullName }
                        </DataDisplay>
                        <DataDisplay icon='subject'>
                            { event.description }
                        </DataDisplay>
                    </Container>
                </ModalBody>
                <ModalFooter>
                    { permalink ? <span className='btn material-icons' onClick={ this.handlePermalinkClick }>open_in_new</span> : undefined }
                    <Button color='secondary' onClick={ onClose }>Close</Button>
                </ModalFooter>
            </Modal>
        );
    }

    public async componentDidUpdate(prevProps: IProps) {
        // Check if event information shown needs to be updated
        if (this.props.eventId !== prevProps.eventId && this.props.eventId && isAuthenticated()) {
            const event = await api.getEventDetails(this.props.eventId, getToken()!);
            this.setState({ subscribed: subscriptions.isSubscribed(event.activityId), event });
        }
    }

    /**
     * Change the subscription state of the events activity
     */
    private toggleSubscription() {
        const activity = this.state.event!.activityId;
        if (subscriptions.isSubscribed(activity)) {
            subscriptions.unsubscribe(activity);
        } else {
            subscriptions.subscribe(activity);
        }
        this.setState({ subscribed: !this.state.subscribed });
    }

    /**
     * Navigate to the permalink page
     */
    private handlePermalinkClick() {
        const { eventId, history } = this.props;
        history.push('/e/' + eventId);
    }
}

export default withRouter(BCCEventDetailModal);