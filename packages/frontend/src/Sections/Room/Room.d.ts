import { Component } from 'react';
import './Room.scss';
interface Props {
    match: any;
}
interface State {
    loading: boolean;
    activeTroubleshootingTypeFilters: string[];
    activeTroubleshootingTagFilters: string[];
    activeSearchQuery: string;
    images?: any;
    room?: any;
    building?: any;
    troubleshootingData?: any;
}
declare class Room extends Component<Props, State> {
    constructor(props: Props);
    componentDidMount(): void;
    fetchRoom(): void;
    fetchBuilding(): void;
    fetchImages(): void;
    fetchTroubleshootingData(): void;
    getTitle(): string;
    getAllTroubleshootingDataTypes(): any[];
    getAllTroubleshootingDataTags(): any[];
    onTypeFilterChange(activeTypeFilters: string[]): void;
    onTagFilterChange(activeTagFilters: string[]): void;
    onFilterSearch(query: string): void;
    imagesAsArray(imagesObject: any): any[];
    render(): JSX.Element;
}
export default Room;
