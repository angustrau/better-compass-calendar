import * as React from 'react';
import {
    ListGroup,
    ListGroupItem
} from 'reactstrap';
import * as admin from './../admin';

interface IState {
    /** The number of users recorded */
    users: number;
    /** The number of students registered */
    students: number;
    /** The number of teachers recorded */
    teachers: number;
    /** The number of events recorded */
    events: number;
    /** The number of logins recorded */
    logins: number;
    /** The number of queries reqorded */
    queries: number;
    /** The number of outbound requests recorded to Compass */
    requests: number;
}

/**
 * BCCAdminStats
 * Renders the stats tab in the admin panel
 */
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
        // The amount of requests the official Compass client will have made (approx)
        // An average of 14 requests are made on every login
        const estimatedCompassRequests = (this.state.logins * 14) + this.state.queries;
        const stats = {
            ...this.state,
            estimated_compass_requests: estimatedCompassRequests,
            /** An estimated number of requests that weren't required */
            requests_saved: estimatedCompassRequests - this.state.requests,
            /** % less requests made */
            requests_saved_percent: (100 - (this.state.requests / estimatedCompassRequests * 100)).toFixed(2)
        };

        const statNames = Object.keys(stats);
        return (
            <ListGroup>
                { statNames.map((stat, key) => {
                    return (
                        <ListGroupItem key={ key } style={{ display: 'flex' }}>
                            <span>{ stat }</span>
                            <span style={{ marginLeft: 'auto' }}>{ stats[stat] }</span>
                        </ListGroupItem>
                    );
                }) }
            </ListGroup>
        );
    }

    public async componentDidMount() {
        // On load, collect statistics directly from the database
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