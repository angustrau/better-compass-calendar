import * as React from 'react';
import {
    Button,
    Input,
    InputGroup,
    InputGroupAddon,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
} from 'reactstrap';
import config from './../config';

interface IProps {
    isOpen: boolean;
    filter: string;
    onClose: () => void;
}

class BCCExportiCalModal extends React.Component<IProps, object> {
    public render() {
        const { isOpen, filter, onClose } = this.props;

        const url = 'webcal://' + config.site.hostname + '/api/ical/' + encodeURIComponent(filter) + '/schedule.ics';

        return (
            <Modal isOpen={ isOpen } toggle={ onClose }>
                <ModalHeader toggle={ onClose }>Export to iCal</ModalHeader>
                <ModalBody>
                    <InputGroup>
                        <Input disabled={ true } value={ url } className='BCCExportiCalModal-url' />
                        <InputGroupAddon addonType='append'>
                            <Button color='secondary' onClick={ () => this.copy() }>Copy</Button>
                        </InputGroupAddon>
                    </InputGroup>
                    <br />
                    <Button tag='a' href={ url }>Open in Calendar</Button>
                </ModalBody>
                <ModalFooter>
                    <Button color='secondary' onClick={ onClose }>Close</Button>
                </ModalFooter>
            </Modal>
        );
    }

    private copy() {
        try {
            const inputArea = document.querySelector('.BCCExportiCalModal-url') as HTMLInputElement;
            inputArea.removeAttribute('disabled');
            inputArea.focus();
            inputArea.select();
            document.execCommand('copy');
            inputArea.setAttribute('disabled', 'true');
        } catch (error) {
            console.log(error);
            return;
        }
        
    }
}

export default BCCExportiCalModal;