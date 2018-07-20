import * as React from 'react';

interface IProps {
    a: string;
}

interface IState {
    innerHTML: string;
}

class ContentEditable extends React.Component<IProps, IState> {
    private ref: React.RefObject<HTMLDivElement>;

    constructor(props: IProps) {
        super(props);

        this.state = {
            innerHTML: ''
        }

        this.ref = React.createRef();
    }

    public render() {
        return (
            <div
                ref={this.ref}
            />
        );
    }

    public shouldComponentUpdate(nextProps: IProps) {
        if (this.ref.current) {
            return this.state.innerHTML !== this.ref.current.innerHTML;
        } else {
            return nextProps !== this.props;
        }
    }

    public componentDidUpdate() {
        return;
    }
}

export default ContentEditable;