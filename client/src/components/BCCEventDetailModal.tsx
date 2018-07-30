import * as React from 'react';
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

interface IProps {
    eventId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

interface IState {
    subscribed: boolean;
    event: IEventDetails | null;
}

class BCCEventDetailModal extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            subscribed: false,
            event: null
        }

        if (this.props.eventId) {
            api.getEventDetails(this.props.eventId, getToken()!)
            .then((event) => {
                this.setState({ subscribed: subscriptions.isSubscribed(event.activityId), event });
            });
        }

        this.toggleSubscription = this.toggleSubscription.bind(this);
    }

    public render() {
        const { isOpen, onClose } = this.props;
        const { subscribed, event } = this.state;

        if (!event) {
            return <div />
        }

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
                    <Button color='secondary' onClick={ onClose }>Close</Button>
                </ModalFooter>
            </Modal>
        );
    }

    public async componentDidUpdate(prevProps: IProps) {
        if (this.props.eventId !== prevProps.eventId && this.props.eventId && isAuthenticated()) {
            const event = await api.getEventDetails(this.props.eventId, getToken()!);
            this.setState({ subscribed: subscriptions.isSubscribed(event.activityId), event });
        }
    }

    private toggleSubscription() {
        const activity = this.state.event!.activityId;
        if (subscriptions.isSubscribed(activity)) {
            subscriptions.unsubscribe(activity);
        } else {
            subscriptions.subscribe(activity);
        }
        this.setState({ subscribed: !this.state.subscribed });
    }
}

export default BCCEventDetailModal;