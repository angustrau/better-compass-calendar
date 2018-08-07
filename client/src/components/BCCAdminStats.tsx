import * as React from 'react';
import {
    ListGroup,
    ListGroupItem
} from 'reactstrap';
import * as admin from './../admin';

interface IState {
    users: number;
    students: number;
    teachers: number;
    events: number;
    logins: number;
    queries: number;
    requests: number;
}

class BCCAdminStats extends React.Component<object, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            users: 0,
            students: 0,
            teachers: 0,
            events: 0,
            logins: 0,
            queries: 0,
            requests: 0
        }
    }

    public render() {
        const estimatedCompassRequests = (this.state.logins * 14) + this.state.queries;
        const stats = {
            ...this.state,
            estimated_compass_requests: estimatedCompassRequests,
            requests_saved: estimatedCompassRequests - this.state.requests,
            requests_saved_percent: (100 - (this.state.requests / estimatedCompassRequests * 100)).toFixed(2)
        };

        const statNames = Object.keys(stats);
        return (
            <ListGroup>
                { statNames.map((stat, key) => {
                    return (
                        <ListGroupItem key={ key } style={{ display: 'flex' }}>
                            <span className='BCCAdminStats-Name'>{ stat }</span>
                            <span className='BCCAdminStats-Value' style={{ marginLeft: 'auto' }}>{ stats[stat] }</span>
                        </ListGroupItem>
                    );
                }) }
            </ListGroup>
        );
    }

    public async componentDidMount() {
        admin.runSQL('SELECT COUNT(*) FROM Users').then((result) => this.setState({ users: result[0]['COUNT(*)'] }));
        admin.runSQL('SELECT COUNT(*) FROM Users WHERE is_manager = 0').then((result) => this.setState({ students: result[0]['COUNT(*)'] }));
        admin.runSQL('SELECT COUNT(*) FROM Users WHERE is_manager = 1').then((result) => this.setState({ teachers: result[0]['COUNT(*)'] }));
        admin.runSQL('SELECT COUNT(*) FROM Events').then((result) => this.setState({ events: result[0]['COUNT(*)'] }));
        admin.runSQL('SELECT COUNT(*) FROM LoginLog').then((result) => this.setState({ logins: result[0]['COUNT(*)'] }));
        admin.runSQL('SELECT COUNT(*) FROM QueryLog').then((result) => this.setState({ queries: result[0]['COUNT(*)'] }));
        admin.runSQL('SELECT COUNT(*) FROM RequestLog').then((result) => this.setState({ requests: result[0]['COUNT(*)'] }));
    }
}

export default BCCAdminStats;