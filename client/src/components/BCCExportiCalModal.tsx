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
    /** Whether the modal is shown */
    isOpen: boolean;
    /** The current filter applied */
    filter: string;
    /** Callback to close the modal */
    onClose: () => void;
}

/**
 * BCCExportiCalModal
 * Renders a modal with iCal export information
 */
class BCCExportiCalModal extends React.Component<IProps, object> {
    public render() {
        const { isOpen, filter, onClose } = this.props;

        // Construct url to iCal API enpoint
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

    /**
     * Copy the iCal URL to the clipboard
     */
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
        }
    }
}

export default BCCExportiCalModal;