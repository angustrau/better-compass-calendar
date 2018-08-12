import * as React from 'react';
import {
    Input,
    Label,
    Modal
} from 'reactstrap';
import * as push from './../push';
import './BCCPushNotifToggle.css';

interface IState {
    /** Whether notifications are enabled */
    notificationState: boolean;
    /** Whether the app is currently asking for notification permissions */
    isPromptingPermission: boolean;
}

/**
 * BCCPushNotifToggle
 * Renders a checkbox that toggles push notification settings
 */
class BCCPushNotifToggle extends React.Component<object, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            notificationState: push.isSubscribed(),
            isPromptingPermission: false
        }

        this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
    }

    public render() {
        const { notificationState, isPromptingPermission } = this.state;

        return (
            <div className='BCCPushNotifToggle-Root'>
                <Input 
                    type='checkbox' 
                    id='BCCPushNotifToggle' 
                    checked={ notificationState }
                    onChange={ this.handleCheckboxClick } 
                />
                <Label for='BCCPushNotifToggle'>Push notifications</Label>
                <Modal isOpen={ isPromptingPermission } />
            </div>
        );
    }

    /**
     * Called when the checkbox is toggled
     */
    private async handleCheckboxClick(event: React.ChangeEvent<HTMLInputElement>) {
        const { notificationState } = this.state;
        
        if (!notificationState) {
            // User is not subscribed to push notifications
            this.setState({ isPromptingPermission: true }, async () => {
                // Ask the user for permission to send push notifications
                const success = await push.promptPermission();
                this.setState({
                    isPromptingPermission: false,
                    notificationState: success
                });
                if (success) {
                    // If permission is allowed, subscribed to push notifications
                    await push.subscribe();
                }
            });
        } else {
            // User is already subscribed to push notifications
            // Unsubscribe from push notifications
            await push.unsubscribe();
            this.setState({
                notificationState: push.isSubscribed()
            });
        }
    }
}

export default BCCPushNotifToggle;