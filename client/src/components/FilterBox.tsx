import * as React from 'react';
import ContentEditable from 'react-contenteditable';
import './FilterBox.css';
import FilterToken from './FilterToken';

interface IProps {
    html: string;
}

interface IState {
    tokens: FilterToken[];
}

class FilterBox extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            tokens: []
        };

        this.handleChange = this.handleChange.bind(this);
    }

    public render() {
        return (
            <ContentEditable
                
            />
        );
    }

    private handleChange(e: React.FormEvent<HTMLDivElement>) {
        e.preventDefault();
    }
}

export default FilterBox;