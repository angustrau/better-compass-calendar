import * as moment from 'moment';
import * as React from 'react';
import BigCalendar from 'react-big-calendar';
import {
    Button,
    InputGroup,
    InputGroupAddon
} from 'reactstrap';
import './IndexRoute.css';

import BCCFilterBox from './../components/BCCFilterBox';
import BCCNavBar from './../components/BCCNavBar';

BigCalendar.momentLocalizer(moment);

class IndexRoute extends React.Component {
    public render() {
        return (
            <div className='IndexRoute-Root'>
                <BCCNavBar />
                <div className='IndexRoute-Body'>
                    <div className='IndexRoute-Controls'>
                        Filter:
                        <InputGroup>
                            <BCCFilterBox />
                            <InputGroupAddon addonType='append'>
                                <Button>Go</Button>
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                </div>
            </div>
        );
    }
}

export default IndexRoute;