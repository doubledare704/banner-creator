import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';

const BAZOOKA_PREFIX = 'projects';

const FontSelect = (props) => (
    <div className="col-md-3">
        <select className="form-control" defaultValue={props.fontList[0]} size="9" onChange={props.changeSelected}>
            {
                props.fontList.map((font) => (
                        <option value={font}>{font}</option>
                    )
                )
            }
        </select>
    </div>
);

const FontShower = (props) => {
    const exampleStyle = {
        'font-family': props.name
    };
    return (<div className="col-md-9">
        <div className="well">
            <p>Имя шрифта: <b>{props.name}</b></p>
            <p>Пример оформления шрифта:</p>
            <div style={exampleStyle}>
                <p>1234567890 ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz </p>
                <p>АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ абвгдеёжзийклмнопрстуфхцчшщъыьэюя</p>
            </div>
        </div>
    </div>)
};

class FontPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fontList: this.props.fontList,
            selectedFont: this.props.fontList[0]
        };

        this.changeSelectedFont = this.changeSelectedFont.bind(this);
    }

    changeSelectedFont(e) {
        this.setState({
            selectedFont: this.state.fontList[e.target.selectedIndex]
        });
    }

    render() {
        let {fontList, selectedFont} = this.state;
        return (
            <div>
                <FontSelect
                    fontList={fontList}
                    changeSelected={this.changeSelectedFont}
                />
                <FontShower name={selectedFont}/>
            </div>
        );
    }
}

export default function (node) {
    let {fontList} = h.getAttrs(BAZOOKA_PREFIX, node);

    ReactDOM.render(
        <FontPanel fontList={fontList}/>,
        node
    );
}
