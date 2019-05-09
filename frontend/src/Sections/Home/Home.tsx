import * as React from 'react';
import { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { Transition, animated } from 'react-spring/renderprops'
import { connect } from 'react-redux';
import { fetchBuildings } from '../../redux/actions/buildingActions';
import { fetchImages } from '../../redux/actions/imageActions';
import _ from 'underscore';

import './Home.scss';

import NavBar from "../../Components/NavBar/NavBar";
import RoomCardsGrid from "../../Components/RoomCardsGrid/RoomCardsGrid";
import LoadingSplash from "../../Components/LoadingSplash/LoadingSplash";


interface Props {
    fetchBuildings: any;
    buildings: any[];
    buildingsLoading: boolean;

    fetchImages: any;
    images: object;
    imagesLoading: boolean;
}

interface State {
    filterSearch: string;
}

class Home extends Component<Props, State> {

    static propTypes = {
        fetchBuildings: PropTypes.func.isRequired,
        buildings: PropTypes.array.isRequired,
        buildingsLoading: PropTypes.bool.isRequired,

        fetchImages: PropTypes.func.isRequired,
        images: PropTypes.object.isRequired,
        imagesLoading: PropTypes.bool.isRequired
    };

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

    getAllRooms() {
        let result: any[] = [];
        for (const building of this.props.buildings) {
            result = result.concat(building.rooms);
        }
        return result;
    }


    getParentBuilding(roomObj: any) {
        for (const building of this.props.buildings) {
            for (const room of building.rooms) {
                if (room.buildingName === roomObj.buildingName && room.number === roomObj.number) return building;
            }
        }
        return null;
    }


    onSearch(value: string) {
        this.setState({
            filterSearch: value
        });
    }

    isLoading() {
        return this.props.buildingsLoading ||
            this.props.imagesLoading;
    }


    render() {

        let self = this;

        var query = this.state.filterSearch;
        var queries = query.split(" ");

        var rooms = _(this.getAllRooms()).chain().sortBy(function (room: any) {
            return room.number;
        }, this).sortBy(function (room: any) {
            return self.getParentBuilding(room).internalName;
        }, this).value();

        for (const q of queries) {
            rooms = rooms.filter(function (room: any) {
                var pb = self.getParentBuilding(room);
                if (!pb) return false;

                var isNick = false;
                for (const nick of pb.nicknames) {
                    if (nick.includes(q)) {
                        isNick = true;
                        break;
                    }
                }

                return (room.number.includes(q) || room.name.includes(q) || pb.internalName.includes(q) || pb.officialName.includes(q) || isNick);
            }, this);
        }

        return (
            <Fragment>

                <Transition
                    native
                    items={this.isLoading()}
                    // from={{ opacity: 0 }}
                    enter={{ opacity: 1 }}
                    leave={{ opacity: 0 }}
                >
                    {(item => item && (styles =>
                        (
                            <animated.div style={styles}>
                                <LoadingSplash />
                            </animated.div>
                        ))
                    )}
                </Transition>

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
                                    buildings={this.props.buildings}
                                    images={this.props.images}
                                />
                            </div>
                        </section>
                    </Fragment>
                }
            </Fragment>
        );
    }
}

const mapStateToProps = (state: any) => ({
    buildings: state.buildings.buildings,
    buildingsLoading: state.buildings.loading,

    images: state.images.images,
    imagesLoading: state.images.loading
});

export default connect(mapStateToProps, { fetchBuildings, fetchImages })(Home);