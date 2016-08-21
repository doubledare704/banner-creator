import React from 'react';
import ReactDOM from 'react-dom';
import {h} from 'bazooka';
import {activatePopUp} from '../popUp.js';
import {csrfToken, ErrorAlert} from '../helpers';

const BAZOOKA_PREFIX = 'projects';

const HEADERS_TEXTS = {
    header1: 'H1 подзаголовок',
    header2: 'H2 подзаголовок',
    header3: 'H3 подзаголовок',
    price1: 'Цена от для большого банера',
    price2: 'Цена от для маленького банера'
};

const HEADERS_ORDER = ['header1', 'header2', 'header3', 'price1', 'price2'];

const FontSelect = (props) => (
    <div className="col-md-2">
        <select className="form-control" onChange={props.changeSelected} defaultValue={props.font || ""}>
            <option disabled value="">Не выбрано</option>
            {
                props.fontList.map((font) => (
                        <option value={font.id}>{font.name}</option>
                    )
                )
            }
        </select>
    </div>
);

const SizeSelect = (props) => (
    <div className="col-md-1">
        <input className="form-control" type="number" min="5" onChange={props.changeSize} defaultValue={props.size}/>
    </div>
);

const HeaderShower = (props) => {
    let headerStyle = {};
    if (props.font) {
        headerStyle['font-family'] = props.font;
    }
    if (props.size) {
        headerStyle['font-size'] = props.size;
    }
    if (props.name.startsWith('price')){
        let headerPriceStyle = headerStyle;
         if (props.size) {
             headerPriceStyle.size = headerPriceStyle / 2;
         }
        return (<div className="col-md-3">
            <span style={headerPriceStyle}>от</span>
            <span style={headerStyle}> 10 </span>
            <span style={headerPriceStyle}>грн</span>
        </div>)
    }
    return (<div className="col-md-3" style={headerStyle}>{HEADERS_TEXTS[props.name]}</div>)
};

class HeadersPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fontList: this.props.fontList,
            headers: this.props.headers,

        };

        this.configChangeSelectedFont = this.configChangeSelectedFont.bind(this);
        this.configChangeSize = this.configChangeSize.bind(this);
        this.save = this.save.bind(this);
    }

    configChangeSelectedFont(name) {
        return (e) => {
            let {fontList, headers} = this.state;
            if (!headers[name]) {
                headers[name] = {}
            }
            headers[name].font_name = fontList[e.target.selectedIndex - 1].name;
            headers[name].font_id = e.target.value;
            this.setState({
                headers: headers
            });
        }
    }

    configChangeSize(name) {
        return (e) => {
            let {headers} = this.state;
            if (!headers[name]) {
                headers[name] = {}
            }
            headers[name].size = e.target.value;
            this.setState({
                headers: headers
            });
        }
    }

    save(e) {
        e.preventDefault();
        const {headers} = this.state;
        let hasEmpty = !Object.keys(headers).every((header) => {
            return headers[header].font_name && headers[header].size
        });
        if (hasEmpty || Object.keys(headers).length < HEADERS_ORDER.length) {
            activatePopUp({
                child: <ErrorAlert text="Шрифт и размер должны быть проставлены для всех пунктов"/>,
                flash: true,
            });
            return
        }
        fetch(`/admin/projects/${this.props.projectId}/headers/`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken()
            },
            body: JSON.stringify(this.state.headers)
        })
            .then((response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                location.reload();
            })
            .catch((response) => {
                console.error(response.message);
                activatePopUp({
                    child: <ErrorAlert text="Произошла ошибка. Попробуйте обновить страницу и повторить попытку"/>,
                    flash: true,
                });
            });
    }

    render() {
        const {fontList, headers} = this.state;
        return (
            <div className="container">
                {
                    HEADERS_ORDER.map((name) => (
                            <Header
                                fontList={fontList}
                                name={name}
                                font_name={(headers[name] || {font_name: ""}).font_name}
                                font_id={(headers[name] || {font_id: ""}).font_id}
                                size={(headers[name] || {}).size}
                                changeFont={this.configChangeSelectedFont(name)}
                                changeSize={this.configChangeSize(name)}
                            />
                        )
                    )
                }
                <div className='form-group'>
                    <button type="submit" className='btn btn-success' onClick={this.save}>Сохранить</button>
                </div>
            </div>
        );
    }
}

class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {fontList, name, font_name, font_id, size} = this.props;
        return (
            <div className="row disperse">
                <div className="col-md-3">{HEADERS_TEXTS[name]}</div>
                <FontSelect
                    fontList={fontList}
                    font={font_id}
                    changeSelected={this.props.changeFont}
                />
                <SizeSelect
                    size={size}
                    changeSize={this.props.changeSize}
                />
                <HeaderShower
                    font={font_name}
                    size={size}
                    name={name}
                />
            </div>
        );
    }
}


export default function (node) {
    let {fontList, headers, projectId} = h.getAttrs(BAZOOKA_PREFIX, node);

    ReactDOM.render(
        <HeadersPanel
            fontList={fontList}
            headers={headers}
            projectId={projectId}
        />,
        node
    );
}
