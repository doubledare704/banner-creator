import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';

const BAZOOKA_PREFIX = 'reviews';

class HistoryCounter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            counting: 0,
            created_at: ''
        }
    }
}

class TableRow extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="box-item">
                <img src={this.props.tablerow.source} alt="nigga"/>
            </div>
        );
    }
}

class Table extends React.Component {
    render() {
        return (
            <div className="alert-info">
                <h2>Banners</h2>
                <div className="box-like-a-boss">

                    {
                        this.props.banners.map((tablerow) =>

                            <TableRow
                                tablerow={tablerow}
                            />
                        )
                    }
                </div>
            </div>
        );
    }
}

class ReviewAdmin extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            banners: this.props.reviewsArray
        }

    }

    // getInitialState

    render() {
        return (
            <Table
                banners={this.state.banners}
            />
        );

    }
}

export default (node) => {
    let {reviews} = h.getAttrs(BAZOOKA_PREFIX, node);
    ReactDOM.render(
        <ReviewAdmin reviewsArray={reviews}/>,
        node
    );
}

