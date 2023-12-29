import React from 'react'

function Modal({children, modalOpen, headerText}) {
    return (
        <div className='import_modal'>
            <div className="modal_body">
                <div className="header">
                    <h4>{headerText}</h4>
                    <button onClick={modalOpen} type="button" className='btn btn-danger btn-sm'><i className='fa fa-close'></i></button>
                </div>
                <div className="body">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal