import React from 'react';
import ReactDOM from 'react-dom';

const CLOSE_TIMEOUT_DELAY = 1500;

const popupNode = document.getElementById('popup');

class PopUp extends React.Component {
    constructor() {
        super();
        this.closeAction = this.closeAction.bind(this);
        this.defaultCloseAction = this.defaultCloseAction.bind(this);
        this.confirmAction = this.confirmAction.bind(this);
        this.setFlash = this.setFlash.bind(this);
    }

    componentDidUpdate() {
        this.setFlash()
    }

    componentDidMount() {
        this.setFlash()
    }

    setFlash(){
        if (this.props.flash) {
            setTimeout(this.closeAction, CLOSE_TIMEOUT_DELAY);
        }
    }

    closeAction() {
        return this.props.onClose ? this.props.onClose() : this.defaultCloseAction()
    }

    defaultCloseAction() {
        return deactivatePopUp()
    }

    confirmAction() {
        if (this.props.confirm) {
            if (this.props.confirmAction) {
                this.props.confirmAction();
            }
            deactivatePopUp();
        }
    }

    render() {
        if (this.props.isVisible) {
            return (
                <div className="modal-dialog modal-lg" id="popup">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={this.closeAction}>&times;</button>
                            {this.props.title ? this.props.title : null}
                        </div>
                        {this.props.children ? <div className="modal-body">{this.props.children}</div> : null}
                        {this.props.confirm ?
                            <div className="modal-footer">
                                <button type="button" className="btn btn-success" onClick={this.confirmAction}>Да
                                </button>
                                <button type="button" className="btn btn-default" onClick={this.closeAction}>
                                    Отменить
                                </button>
                            </div>
                            : null
                        }
                    </div>
                </div>
            );
        }
        return null;
    }
}

window.addEventListener('click', (e) => { deactivatePopUp() });

export function activatePopUp(data) {
    ReactDOM.render(<PopUp
        confirm={data.confirm}
        isVisible={true}
        title={data.title}
        flash={data.flash}
        onClose={data.closeAction}
        confirmAction={data.confirmAction}
    >{data.child}</PopUp>, popupNode);
}

export function deactivatePopUp() {
    ReactDOM.render(<PopUp isVisible={false}/>, popupNode);
}
