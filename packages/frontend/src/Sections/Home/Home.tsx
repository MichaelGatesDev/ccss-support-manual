import * as React from 'react';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';

import './Home.scss';

import NavBar from "../../Components/NavBar/NavBar";
import RoomCardsGrid from "../../Components/RoomCardsGrid/RoomCardsGrid";
import LoadingSplash from "../../Components/LoadingSplash/LoadingSplash";

import { AppState } from '../../redux/store';
import { fetchBuildings } from '../../redux/buildings/actions';
import { fetchImages } from '../../redux/images/actions';
import { BuildingsState } from '../../redux/buildings/types';
import { ImagesState } from '../../redux/images/types';

import { Building, Room, BuildingUtils } from "@ccss-support-manual/common";

interface Props {
    buildingsState: BuildingsState;
    imagesState: ImagesState;

    fetchBuildings: Function;
    fetchImages: Function;
}

interface State {
    filterSearch: string;
}

class Home extends Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            filterSearch: ''
        };

        this.onSearch = this.onSearch.bind(this);
    }


    componentDidMount() {
        this.props.fetchBuildings();
        this.props.fetchImages();
    }

    getAllRooms(): Room[] {
        let result: Room[] = [];
        for (const building of this.props.buildingsState.buildings) {
            result = result.concat(building.rooms);
        }
        return result;
    }


    getParentBuilding(room: Room): Building | null {
        for (const building of this.props.buildingsState.buildings) {
            if (room.buildingName === building.internalName) return building;
        }
        return null;
    }


    onSearch(value: string) {
        this.setState({
            filterSearch: value
        });
    }

    isLoading(): boolean {
        return this.props.buildingsState.buildingsLoading || this.props.imagesState.imagesLoading;
    }


    render() {

        let self = this;

        let rooms: Room[] = [];
        if (!this.isLoading()) {
            let query = this.state.filterSearch;
            let queries = query.split(" ");
            rooms = _(this.getAllRooms()).chain().sortBy(function (room: Room) {
                return room.number;
            }, this).sortBy(function (room: Room) {
                return room.buildingName;
            }, this).value();

            for (const q of queries) {
                rooms = rooms.filter(function (room: Room) {
                    let pb = self.getParentBuilding(room);
                    if (!pb) return false;
                    return (room.number.includes(q) || BuildingUtils.hasName(pb, q));
                }, this);
            }
        }

        return (
            <Fragment>

                {this.isLoading() &&
                    <LoadingSplash />
                }

                {!this.isLoading() &&
                    <Fragment>
                        <NavBar
                            title="CCSS Support Manual"
                            searchable={true}
                            onSearch={this.onSearch}
                            fixed={true}
                        />
                        <section className="container-fluid" id="home-section">
                            <div className="Home-Component">
                                <RoomCardsGrid
                                    rooms={rooms}
                                    buildings={this.props.buildingsState.buildings}
                                    images={this.props.imagesState.images}
                                />
                            </div>
                        </section>
                    </Fragment>
                }
            </Fragment>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    buildingsState: state.buildings,
    imagesState: state.images,
});

export default connect(
    mapStateToProps,
    { fetchBuildings, fetchImages }
)(Home);
