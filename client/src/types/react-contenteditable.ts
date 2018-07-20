declare module 'react-contenteditable' {
    import { Component, HTMLProps } from 'react';

    interface IProps extends HTMLProps<HTMLDivElement> {
        tagName?: string,
        html?: string
    }

    export default class ContentEditable extends Component<IProps, object> {}
}