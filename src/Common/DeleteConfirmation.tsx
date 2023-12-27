import React from "react";

interface MyComponentProps {
  modal: boolean;
  closeModal: (isModal: boolean) => void;
  confirmedDelete: () => void;
  actionType: string;
}

function DeleteConfirmationModal(props: MyComponentProps) {
  const { modal, closeModal, confirmedDelete, actionType } = props;

  return (
    <div
      className={`modal fade" ${modal ? "show" : "hide"}`}
      id="modalDefault"
      style={{ display: modal ? "block" : "none" }}
    >
      <div className="modal-dialog modal-dialog-top" role="document">
        <div className="modal-content">
          <a
            onClick={() => closeModal(false)}
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <em className="icon ni ni-cross"></em>
          </a>
          <div className="modal-header text-center">
            <h5 className="modal-title w-100">Please Confirm</h5>
          </div>
          <div className="modal-body text-center">
            <p>Are you sure you want to remove this {actionType} ?</p>
          </div>
          <div className="modal-footer bg-light">
            <button
              onClick={() => closeModal(false)}
              className="btn btn-secondary btn-sm"
            >
              No
            </button>
            <button
              onClick={() => confirmedDelete()}
              className="btn btn-danger btn-sm"
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
