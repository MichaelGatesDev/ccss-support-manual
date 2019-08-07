import { Component } from 'react';
import './GeneralInfo.scss';
interface Props {
    title: string;
    room: any;
}
interface State {
}
declare class GeneralInfo extends Component<Props, State> {
    constructor(props: Props);
    componentDidMount(): void;
    render(): JSX.Element;
}
export default GeneralInfo;
