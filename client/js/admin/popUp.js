import Rx from 'rx';
import React from 'react';
import ReactDOM from 'react-dom';

let popupEvent = new Rx.Subject();

export default class PopUpLocation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            popup: ""
        };
    }

    componentDidMount() {
        popupEvent.filter( (data) => {
            return data.action === 'change'
        }).subscribe((data) => {
            this.setState({popup: <PopUp title={data.data.data} confirm={data.data.confirm} confirmClick={data.data.confirmAction}/>});
        });

        popupEvent.filter( (data) => {
            return data.action === 'close'
        }).subscribe((data) => {
            this.setState({popup: ""});
        });
    }
    
    render() {
        return (
            <div>
                {this.state.popup}
            </div>
        )
    }
}

export default class PopUp extends React.Component {
    constructor(props) {
        super(props);

        this.onClose = this.onClose.bind(this);
    }

    static change(data) {
        popupEvent.onNext({action: 'change', data: data});
    }

    componentDidMount() {
        if ( !this.props.confirm ) {
            setTimeout(this.onClose, 1500);
        }
    }

    onClose() {
        popupEvent.onNext({action: 'close'});
    }

    addConfirm(confirm, confirmClick) {
        if ( confirm === true ) {
            let confirmAction = () => {
                confirmClick();
                this.onClose();
            };

             return (
                 <div>
                     <button className="Yes" onClick={confirmAction}>
                         <i>Да</i>
                     </button>
                     <button className="Close" onClick={this.onClose}>
                         <i>Отменить</i>
                     </button>
                 </div>
             )
        }
    }

    render() {
        return (
            <div className="modal-content">
                <span className="close" onClick={this.onClose}>×</span>
                <h1>{this.props.title}</h1>
                {this.addConfirm(this.props.confirm, this.props.confirmClick)}
            </div>
        )
    }
}

ReactDOM.render( <PopUpLocation/>, document.getElementById('popup'));

module.exports = {
    'popup': PopUp.change
};
