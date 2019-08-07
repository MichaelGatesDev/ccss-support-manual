import { Component } from 'react';
import './Home.scss';
import { BuildingsState } from '../../redux/buildings/types';
import { ImagesState } from '../../redux/images/types';
import { Building, Room } from "@ccss-support-manual/common";
interface Props {
    buildingsState: BuildingsState;
    imagesState: ImagesState;
    fetchBuildings: Function;
    fetchImages: Function;
}
interface State {
    filterSearch: string;
}
declare class Home extends Component<Props, State> {
    constructor(props: Props);
    componentDidMount(): void;
    getAllRooms(): Room[];
    getParentBuilding(room: Room): Building | null;
    onSearch(value: string): void;
    isLoading(): boolean;
    filterRoomsByName(rooms: Room[], name: string, filterNumber?: boolean, filterName?: boolean, filterBuildingName?: boolean): Room[];
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponentClass<typeof Home, Pick<Props, never>>;
export default _default;
