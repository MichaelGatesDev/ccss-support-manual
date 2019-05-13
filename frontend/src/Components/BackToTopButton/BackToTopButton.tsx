import * as React from 'react';
import { Component } from 'react';
import posed, { PoseGroup } from 'react-pose';

import './BackToTopButton.scss';

interface Props {
    minScrollAmt: number;
    preventDefault?: boolean;
}

interface State {
    visible: boolean;
}

const BackToTopButtonDiv = posed.div({
    enter: { opacity: 1 },
    exit: { opacity: 0 }
});

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
            <PoseGroup>
                {this.state.visible && [
                    <BackToTopButtonDiv className="BackToTopButton-Component" key="BackToTopButton">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={this.onClick}
                            data-toggle="tooltip"
                            title="Back to Top"
                        >
                            <label htmlFor="backToTop"><i className="fas fa-arrow-alt-circle-up"></i></label>
                        </button>
                    </BackToTopButtonDiv>
                ]}
            </PoseGroup>
        );
    }
}

export default BackToTopButton;