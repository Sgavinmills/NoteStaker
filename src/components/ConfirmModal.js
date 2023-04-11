import React from 'react';
import ModalStyles from "../CSS/Modal.module.css";

const ConfirmModal = ({handleDelete, setIsModalOpen, confirmationMessage}) => {

  return (
    <div className={`${ModalStyles["modal-container"]} ${ModalStyles[""]}`}>
     <div className={`${ModalStyles["modal-content"]}`}>
      <div className={`${ModalStyles["modal-message"]}`}>
        <p>{confirmationMessage}</p>

      </div>
      <div className={`${ModalStyles["modal-options"]}`}>
        <button className={`${ModalStyles["modal-option"]}`} onClick={handleDelete}>Yes</button>
        <button className={`${ModalStyles["modal-option"]}`} onClick={() => setIsModalOpen(false)}>No</button>
    </div>

     </div>
    </div>
  );
};

export default ConfirmModal;
