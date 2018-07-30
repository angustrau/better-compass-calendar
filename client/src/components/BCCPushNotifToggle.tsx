import * as React from 'react';
import {
    Input,
    Label,
    Modal
} from 'reactstrap';
import * as push from './../push';
import './BCCPushNotifToggle.css';

interface IState {
    notificationState: boolean;
    isPromptingPermission: boolean;
}

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

    private async handleCheckboxClick(event: React.ChangeEvent<HTMLInputElement>) {
        const { notificationState } = this.state;
        
        if (!notificationState) {
            this.setState({ isPromptingPermission: true }, async () => {
                const success = await push.promptPermission();
                this.setState({
                    isPromptingPermission: false,
                    notificationState: success
                });
                if (success) {
                    await push.subscribe();
                }
            });
        } else {
            await push.unsubscribe();
            this.setState({
                notificationState: push.isSubscribed()
            });
        }
    }
}

export default BCCPushNotifToggle;