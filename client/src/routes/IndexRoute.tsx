import * as moment from 'moment';
import * as React from 'react';
import BigCalendar from 'react-big-calendar';
import { 
    RouteComponentProps, 
    withRouter 
} from 'react-router-dom';
import {
    Button,
    InputGroup,
    InputGroupAddon
} from 'reactstrap';
import './IndexRoute.css';

import BCCFilterBox from './../components/BCCFilterBox';
import BCCNavBar from './../components/BCCNavBar';

BigCalendar.momentLocalizer(moment);

interface IRouterProps {
    filter?: string;
}

interface IProps extends RouteComponentProps<IRouterProps> {
    
}

interface IState {
    filter: string;
}

class IndexRoute extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);

        this.state = {
            filter: decodeURIComponent(this.props.match.params.filter || 'subscribed ')
        }

        this.handleFilterChange = this.handleFilterChange.bind(this);
    }

    public render() {
        return (
            <div className='IndexRoute-Root'>
                <BCCNavBar />
                <div className='IndexRoute-Body'>
                    <div className='IndexRoute-Controls'>
                        <div className='IndexRoute-ControlsLeft'>
                            <InputGroup>
                                <InputGroupAddon addonType='prepend'>Filter:</InputGroupAddon>
                                <BCCFilterBox filter={this.state.filter} onChange={this.handleFilterChange} />
                                <InputGroupAddon addonType='append'>
                                    <Button>Go</Button>
                                </InputGroupAddon>
                            </InputGroup>
                            <Button>Export iCal</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private handleFilterChange(filter: string) {
        this.setState({ filter });

        if (filter === '') {
            this.props.history.replace('/');
        } else {
            this.props.history.replace('/f/' + encodeURIComponent(filter));
        }
    }
}

export default withRouter(IndexRoute);