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
import BCCAdminStats from '../components/BCCAdminStats';
import BCCNavBar from '../components/BCCNavBar';
import * as user from '../user';
import * as admin from './../admin';

interface IRouterProps {
    /** The currently being shown */
    tab?: string
}

interface IProps extends RouteComponentProps<IRouterProps> {}

/**
 * AdminRoute
 * Renders the administration page
 */
class AdminRoute extends React.Component<IProps, object> {
    constructor(props: any) {
        super(props);

        this.handleSendPush = this.handleSendPush.bind(this);
        this.handleRunSQL = this.handleRunSQL.bind(this);
    }

    public render() {
        // Check that the user is authorised
        if (!user.getUser().isAdmin) {
            return <Redirect push={true} to='/' />
        }

        const tab = this.props.match.params.tab || 'Stats';

        return (
            <div>
                <BCCNavBar />
                <div>
                    <Nav tabs={true}>
                        { this.renderTabLink('Stats') }
                        { this.renderTabLink('SQL') }
                        { this.renderTabLink('Push') }
                    </Nav>
                    <TabContent activeTab={ tab }>
                        <TabPane tabId='Stats'>
                            <BCCAdminStats />
                        </TabPane>
                        <TabPane tabId='SQL'>
                            Query:
                            <Input type='textarea' id='AdminRoute-SQL-Query' />
                            <Button onClick={ this.handleRunSQL }>Run</Button>
                            <div id='AdminRoute-SQL-Result' />
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
        const tab = this.props.match.params.tab || 'Stats';
        return (
            <NavItem>
                <NavLink
                    className={ tab === name ? 'active' : '' }
                    onClick={ () => this.toggleTab(name) }
                >
                    { name }
                </NavLink>
            </NavItem>
        );
    }
    
    /**
     * Switch to a tab
     */
    private toggleTab(name: string) {
        this.props.history.push('/admin/' + name);
    }

    /**
     * Send a push notification to a user
     */
    private handleSendPush() {
        const userIdInput = document.getElementById('AdminRoute-Push-UserID') as HTMLInputElement;
        const dataInput = document.getElementById('AdminRoute-Push-Data') as HTMLInputElement;
        admin.sendPush(parseInt(userIdInput.value, 10), JSON.parse(dataInput.value));
    }

    /**
     * Run an arbitrary SQL statement against the database and display the result
     */
    private async handleRunSQL() {
        const queryInput = document.getElementById('AdminRoute-SQL-Query') as HTMLInputElement;
        const resultInput = document.getElementById('AdminRoute-SQL-Result') as HTMLInputElement;
        const result = await admin.runSQL(queryInput.value);
        resultInput.innerText = JSON.stringify(result, null, 2);
    }
}

export default withRouter(AdminRoute);