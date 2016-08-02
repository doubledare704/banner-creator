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
    }

    static change(data) {
        popupEvent.onNext({action: 'change', data: data});
    }

    componentDidMount() {
        popupEvent.filter((data) => {
            return data.action === 'change'
        }).subscribe((data) => {
            this.setState({
                title: data.data.data,
                confirm: data.data.confirm,
                flash: data.data.flash,
                confirmClick: data.data.confirmAction,
                visible: true
            });

            if (data.data.flash) {
                setTimeout(PopUp.onClose, 1500);
            }
        });

        popupEvent.filter((data) => {
            return data.action === 'close'
        }).subscribe((data) => {
            this.setState({visible: false});
        });
    }

    static onClose() {
        popupEvent.onNext({action: 'close'});
    }

    render() {
        if (this.state.visible === true) {
            return (
                <div className="modal-dialog modal-lg" id="popup">
                    <div className="modal-content">

                        <div className="modal-header">
                            <button type="button" className="close" onClick={PopUp.onClose}>&times;</button>
                            {(() => {
                                if (this.state.title) {
                                    return (<h4 className="modal-title">{this.state.title}</h4>)
                                }
                            })()
                            }
                        </div>

                        {(() => {
                            if (this.state.body) {
                                return (
                                    <div className="modal-body">
                                        <p>{this.state.body}</p>
                                    </div>
                                )
                            }
                        })()}

                        {(() => {
                            if (this.state.confirm) {
                                let confirmAction = () => {
                                    this.state.confirmClick();
                                    PopUp.onClose();
                                };

                                return (
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-success" onClick={confirmAction}>Да
                                        </button>
                                        <button type="button" className="btn btn-default" onClick={PopUp.onClose}>
                                            Отменить
                                        </button>
                                    </div>
                                )
                            }
                        })()}

                    </div>
                </div>
            );
        }
        return null;
    }
}

ReactDOM.render(<PopUp/>, document.getElementById('popup'));

module.exports = {
    'popup': PopUp
};
