function Modal({text,modalActions}) {
    return (
        <div className="modal">
          <div className="modal_conatiner">
            <h1 className="modal_text">{text}</h1>
            <div className="modal_btn_container">
              <button
                className="cancel_delete"  
                onClick={ () => modalActions(false) }>
                 Cancel
              </button>
              <button
                className="allow_delete"  
                onClick={ () => modalActions(true) }>
                 Yes
              </button>
            </div>
          </div>
        </div>
    )
}

export default Modal;