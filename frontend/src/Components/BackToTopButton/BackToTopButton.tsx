import * as React from 'react';
import { Component } from 'react';

import './BackToTopButton.scss';

import { Transition, animated } from 'react-spring/renderprops'

interface Props {
    minScrollAmt: number;
    preventDefault?: boolean;
}

interface State {
    visible: boolean;
}

class BackToTopButton extends Component<Props, State> {

    constructor(props: any) {
        super(props);

        this.state = {
            visible: false
        };

        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        var currentScrollAmt = window.scrollY;
        this.setState({ visible: currentScrollAmt > this.props.minScrollAmt });
    };

    onClick(e: React.MouseEvent) {
        if (this.props.preventDefault) {
            e.preventDefault();
        }
        window.scrollTo(0, 0);
    }

    render() {
        return (
            <Transition
                native
                items={this.state.visible}
                from={{ opacity: 0 }}
                enter={{ opacity: 1 }}
                leave={{ opacity: 0 }}
            >
                {(item => item && (styles =>
                    (
                        <animated.div style={styles}>
                            <div className="BackToTopButton-Component">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    onClick={this.onClick}
                                    data-toggle="tooltip"
                                    title="Back to Top"
                                >
                                    <label htmlFor="backToTop"><i className="fas fa-arrow-alt-circle-up"></i></label>
                                </button>
                            </div>
                        </animated.div>
                    ))
                )}
            </Transition>
        );
    }
}

export default BackToTopButton;