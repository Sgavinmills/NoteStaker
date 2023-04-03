import React from 'react';
import styles from "../CSS/Card.module.css";


const AddNoteCard = ({showAddNoteForm, setShowAddNoteForm}) => {

  
  return (
    <div className={`${styles["card-container"]} ${styles["add-note-container"]}`} onClick={() => setShowAddNoteForm(!showAddNoteForm)}>
      <p className={styles["main-text"]}>Add Note (+)</p>
    </div>
  );
};

export default AddNoteCard;
