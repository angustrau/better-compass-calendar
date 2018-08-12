import * as React from 'react';
import {
    Button,
    Container,
    FormGroup,
    Input,
    Label,
    Table
} from 'reactstrap';
import * as api from '../api';
import * as auth from './../auth';
import BCCNavBar from './../components/BCCNavBar';
import * as push from './../push';
import * as user from './../user';
import './AccountSettingsRoute.css';

interface IState {
    /** Details of the logged in user */
    userDetails: api.IUserDetails,
    /** A list of devices with push enabled */
    pushSubscriptions: api.IPushSubscription[]
}

/**
 * AccountSettingsRoute
 * Renders the account settings screen
 */
class AccountSettingsRoute extends React.Component<object, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            userDetails: user.getUser(),
            pushSubscriptions: []
        }

        this.handleDeleteAccount = this.handleDeleteAccount.bind(this);
    }

    public render() {
        const { userDetails, pushSubscriptions } = this.state;

        return (
            <div>
                <BCCNavBar />
                <Container className='AccountSettingsRoute-Body'>
                    <FormGroup>
                        <Label for='accountName'><b>Name:</b></Label>
                        <Input id='accountName' disabled={true} value={ userDetails.fullName } />
                    </FormGroup>
                    <FormGroup>
                        <Label for='accountDisplayCode'><b>Username:</b></Label>
                        <Input id='accountDisplayCode' disabled={true} value={ userDetails.displayCode } />
                    </FormGroup>
                    <FormGroup>
                        <Label for='accountEmail'><b>Email:</b></Label>
                        <Input id='accountEmail' disabled={true} value={ userDetails.email } />
                    </FormGroup>
                    <FormGroup>
                        <Label for='accountPush'><b>Push Notifications:</b></Label>
                        <div id='accountPush'>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Device name</th>
                                        <th />
                                    </tr>
                                </thead>
                                <tbody>
                                    { pushSubscriptions.map((subscription, key) => {
                                        return (
                                            <tr key={ key }>
                                                <td>
                                                    { subscription.deviceName }
                                                    { push.getDeviceID() === subscription.deviceName ? <b> (This)</b> : '' }
                                                </td>
                                                <td>
                                                    <div className='AccountSettingsRoute-PushDelete'>
                                                        <Button outline={true} onClick={ () => this.handlePushUnsubscribe(subscription) }>Delete</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }) }
                                </tbody>
                            </Table>
                        </div>
                    </FormGroup>
                    <Button outline={true} color='danger' onClick={ this.handleDeleteAccount }>Delete account</Button>
                </Container>
            </div>
        );
    }

    public async componentDidMount() {
        // Listen for user detail updates
        user.events.addEventListener('update', this.updateUserDetails);
        // Get a list of current push subscriptions
        this.setState({ pushSubscriptions: await api.getPushSubscriptions(auth.getToken()!) });
    }

    public componentWillUnmount() {
        user.events.removeEventListener('update', this.updateUserDetails);
    }

    /**
     * Called when user details change
     */
    private updateUserDetails() {
        this.setState({ userDetails: user.getUser() });
    }

    /**
     * Disable push for a device
     */
    private async handlePushUnsubscribe(subscription: api.IPushSubscription) {
        // Tell server to remove a device
        await api.pushUnsubscribe(subscription, auth.getToken()!);
        // Remove the device from the displayed list
        this.setState({ pushSubscriptions: this.state.pushSubscriptions.filter(x => x !== subscription) });
    }

    /**
     * Delete the user's account
     */
    private handleDeleteAccount() {
        const confirmed = window.confirm('Are you sure you would like to delete your account?');
        if (confirmed) {
            api.deleteUser(auth.getToken()!);
            auth.logout();
        }
    }
}

export default AccountSettingsRoute;