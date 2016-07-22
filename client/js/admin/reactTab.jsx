import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';


const BAZOOKA_PREFIX = 'header';


 class Tab extends React.Component {
        render() {
            return (
                <li className={this.props.name} onClick={this.props.onClick}><a data-toggle="tab" href={'#'+this.props.name}>{this.props.title}</a></li>
            );
        }
    }


    class TableRow extends React.Component {

        constructor(props) {
            super(props);

            this.handleTableRowRemove = this.handleTableRowRemove.bind(this);
        }


        handleTableRowRemove() {
          this.props.onTableRowDelete( this.props.tablerow );
          return false;
        }

        render() {
            let onClickAction = this.onClickDel;

            return (
                <tr className={this.props.tablerow.active} >
                    <td>
                        {this.props.tablerow.title}{this.props.tablerow.active}
                    </td>
                    <td>
                        <img src={this.props.tablerow.preview} alt="cat" />
                    </td>
                    <td>
                        <button className="btn btn-default" onClick={this.handleTableRowRemove}>
                            <i className="glyphicon glyphicon-trash"/>
                            <i>Delete</i>
                        </button>
                    </td>
               </tr>
            );
        }
    }


    class Table extends React.Component {

        constructor(props) {
            super(props);

            this.handleTableRowRemove = this.handleTableRowRemove.bind(this);
        }

        handleTableRowRemove(tablerow){
          this.props.onTableRowRemove( tablerow );
        }

        render() {
            let tablerows = [];
            let that = this;
            this.props.backgrounds.forEach(function(tablerow) {
                tablerows.push(<TableRow key={tablerow.id} tablerow={tablerow} onTableRowDelete={that.handleTableRowRemove} /> );
            });

            return (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Image</th>
                            <th>
                            </th>
                        </tr>
                    </thead>
                    <tbody>{tablerows}</tbody>
                </table>
            );
        }
    }


    class Head extends React.Component {
        activeBackgrounds() {
            return this.props.backgroundsArray.filter(function(el) {
                if ( el.active == 'True' ) {
                    return el;
                }
            });
        }


        inactiveBackgrounds() {
            return this.props.backgroundsArray.filter(function(el) {
                if ( el.active == 'False' ) {
                    return el;
                }
            });
        }


        constructor(props) {
            super(props);

            this.inactiveTabClick = this.inactiveTabClick.bind(this);
            this.activeTabClick = this.activeTabClick.bind(this);
        }


        getInitialState() {
            let backgrounds = activeBackgrounds();

            this.state = {
                backgrounds: backgrounds
            };
        }


        inactiveTabClick() {
            let backgrounds = inactiveBackgrounds();

            this.setState({
                backgrounds: backgrounds
            });
        }


        activeTabClick() {
            let backgrounds = activeBackgrounds();

            this.setState({
                backgrounds: backgrounds
            });
        }


        render() {
            return (
                <div>
                    <ul className= "nav nav-tabs">
                        <Tab onClick={this.activeTabClick} name="active" title="Активные фоны"/>
                        <Tab onClick={this.inactiveTabClick} name="inactive" title="Неактивные фоны"/>
                    </ul>
                    <Table backgrounds={this.state.backgrounds}/>
                </div>
            );
        }
    }


export default function (node) {
    let {backgroundsArray} = h.getAttrs(BAZOOKA_PREFIX, node);

    ReactDOM.render(
        <Head backgroundsArray = {backgroundsArray} />,
        node
    );
}