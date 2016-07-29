import Rx from 'rx';
import React from 'react';
import ReactDOM from 'react-dom';

let popupEvent = new Rx.Subject();

export default class PopUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };

        this.onClose = this.onClose.bind(this);
        this.showPopUp = this.showPopUp.bind(this);
    }

    static change(data) {
        popupEvent.onNext({action: 'change', data: data});
    }

    componentDidMount() {
        popupEvent.filter( (data) => {
            return data.action === 'change'
        }).subscribe((data) => {
            this.setState({
                title:data.data.data,
                confirm:data.data.confirm,
                confirmClick:data.data.confirmAction,
                visible: true
            });

            if ( !data.data.confirm ) {
                setTimeout(this.onClose, 1500);
            }
        });

        popupEvent.filter( (data) => {
            return data.action === 'close'
        }).subscribe((data) => {
            this.setState({visible: false});
        });
    }

    onClose() {
        popupEvent.onNext({action: 'close'});
    }

    showPopUp() {
        if (this.state.visible === true) {
            return (
                <div className="modal-content">
                    <span className="close" onClick={this.onClose}>×</span>
                    <h1>{this.state.title}</h1>
                    {this.addConfirm(this.state.confirm, this.state.confirmClick)}
                </div>
            );
        } else {
            return null;
        }
    }

    addConfirm(confirm, confirmClick) {
        if (confirm !== true) {
            return null;
        }
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
        return this.showPopUp()
    }
}

ReactDOM.render( <PopUp/>, document.getElementById('popup'));

module.exports = {
    'popup': PopUp.change
};