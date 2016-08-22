import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';
import {activatePopUp} from '../popUp.js';
import {csrfToken, ErrorAlert} from '../helpers';


const BAZOOKA_PREFIX = 'projects';

const FontSelect = (props) => (
    <div className="col-md-3">
        <select className="form-control" defaultValue={(props.fontList[0] || {}).id} size="9" onChange={props.changeSelected}>
            {
                props.fontList.map((font) => (
                        <option value={font.id}>{font.readable_name}</option>
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
            <p>Имя шрифта: <b>{props.readable_name}</b></p>
            <p>Пример оформления шрифта:</p>
            <div style={exampleStyle}>
                <p>1234567890 ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz </p>
                <p>АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ абвгдеёжзийклмнопрстуфхцчшщъыьэюя</p>
            </div>
            {
                (props.isAdmin && props.name) ?
                    <div className="text-right">
                        <button className="btn btn-danger btn-sm" onClick={props.removeFont}>
                            <i className="glyphicon glyphicon-trash"/> Удалить
                        </button>
                    </div>
                    : null
            }
        </div>
    </div>)
};

class FontPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fontList: this.props.fontList,
            selectedFontNumber: 0
        };

        this.changeSelectedFont = this.changeSelectedFont.bind(this);
        this.removeFont = this.removeFont.bind(this);
    }

    changeSelectedFont(e) {
        this.setState({
            selectedFontNumber: e.target.selectedIndex
        });
    }

    removeFont() {
        let {fontList, selectedFontNumber} = this.state;
        activatePopUp({
            title: "Вы действительно хотите удалить шрифт? Операция не может быть отменена.",
            confirm: true,
            confirmAction: () => {
                fetch(`/admin/projects/fonts/${fontList[selectedFontNumber].id}`, {
                        credentials: 'same-origin',
                        method: "DELETE",
                        headers: {
                            'X-CSRFToken': csrfToken()
                        }
                    }
                ).then((response) => {
                    if (!response.ok) {
                        throw Error(response.statusText);
                    }
                    fontList.splice(selectedFontNumber, 1);
                    this.setState({
                        fontList: fontList
                    });
                })
                    .catch((response) => {
                        console.error(response.message);
                        activatePopUp({
                            child: <ErrorAlert text="Произошла ошибка. Попробуйте обновить страницу и повторить попытку"/>,
                            flash: true,
                        });
                    });
            }
        })
    }

    render() {
        let {fontList, selectedFontNumber} = this.state;
        const selectedFont = fontList[selectedFontNumber];
        return (
            <div>
                <FontSelect
                    fontList={fontList}
                    changeSelected={this.changeSelectedFont}
                />
                <FontShower
                    name={(selectedFont || {}).name}
                    readable_name={(selectedFont || {}).readable_name}
                    isAdmin={this.props.isAdmin}
                    removeFont={this.removeFont}
                />
            </div>
        );
    }
}

export default function (node) {
    let {fontList, isAdmin} = h.getAttrs(BAZOOKA_PREFIX, node);

    ReactDOM.render(
        <FontPanel
            fontList={fontList}
            isAdmin={isAdmin}
        />,
        node
    );
}
