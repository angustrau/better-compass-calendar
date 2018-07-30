import * as React from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import {
    Button,
    Input,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane
} from 'reactstrap';
import BCCNavBar from '../components/BCCNavBar';
import * as user from '../user';
import * as admin from './../admin';

interface IRouterProps {
    tab?: string
}

interface IProps extends RouteComponentProps<IRouterProps> {}

interface IState {
    activeTab: string;
}

class AdminRoute extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            activeTab: this.props.match.params.tab || 'Stats'
        }

        this.handleSendPush = this.handleSendPush.bind(this);
    }

    public render() {

        if (!user.getUser().isAdmin) {
            return <Redirect push={true} to='/' />
        }

        return (
            <div>
                <BCCNavBar />
                <div>
                    <Nav tabs={true}>
                        { this.renderTabLink('Stats') }
                        { this.renderTabLink('Log') }
                        { this.renderTabLink('Users') }
                        { this.renderTabLink('Events') }
                        { this.renderTabLink('SQL') }
                        { this.renderTabLink('Push') }
                    </Nav>
                    <TabContent activeTab={ this.state.activeTab }>
                        <TabPane tabId='Stats'>
                            Hello
                        </TabPane>
                        <TabPane tabId='Log'>
                            Hello
                        </TabPane>
                        <TabPane tabId='Users'>
                            Hello
                        </TabPane>
                        <TabPane tabId='Events'>
                            Hello
                        </TabPane>
                        <TabPane tabId='SQL'>
                            Hello
                        </TabPane>
                        <TabPane tabId='Push'>
                            User ID:
                            <Input id='AdminRoute-Push-UserID' />
                            Data:
                            <Input type='textarea' id='AdminRoute-Push-Data'  />
                            <Button onClick={ this.handleSendPush }>Send</Button>
                        </TabPane>
                    </TabContent>
                </div>
            </div>
        );
    }

    private renderTabLink(name: string) {
        return (
            <NavItem>
                <NavLink
                    className={ this.state.activeTab === name ? 'active' : '' }
                    onClick={ () => this.toggleTab(name) }
                >
                    { name }
                </NavLink>
            </NavItem>
        );
    }
    
    private toggleTab(name: string) {
        this.setState({ activeTab: name });
        this.props.history.push('/admin/' + name);
    }

    private handleSendPush() {
        const userIdInput = document.getElementById('AdminRoute-Push-UserID') as HTMLInputElement;
        const dataInput = document.getElementById('AdminRoute-Push-Data') as HTMLInputElement;
        admin.sendPush(parseInt(userIdInput.value, 10), JSON.parse(dataInput.value));
    }
}

export default withRouter(AdminRoute);