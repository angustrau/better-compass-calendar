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
import * as location from './../location';
import * as subscriptions from './../subscriptions';
import * as user from './../user';
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
    event: IEventDetails | null;
    isOpen: boolean;
    onClose: () => void;
}

interface IState {
    subscribed: boolean;
}

class BCCEventDetailModal extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            subscribed: this.props.event ? subscriptions.isSubscribed(this.props.event.activityId) : false
        }

        this.toggleSubscription = this.toggleSubscription.bind(this);
    }

    public render() {
        const { event, isOpen, onClose } = this.props;
        const { subscribed } = this.state;

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

    public componentDidUpdate(prevProps: IProps) {
        if (this.props.event !== prevProps.event && this.props.event) {
            this.setState({ subscribed: subscriptions.isSubscribed(this.props.event.activityId) });
        }
    }

    private toggleSubscription() {
        const activity = this.props.event!.activityId;
        if (subscriptions.isSubscribed(activity)) {
            subscriptions.unsubscribe(activity);
        } else {
            subscriptions.subscribe(activity);
        }
        this.setState({ subscribed: !this.state.subscribed });
    }
}

export default BCCEventDetailModal;