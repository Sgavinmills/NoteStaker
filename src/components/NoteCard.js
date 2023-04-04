import React, { useState } from 'react';
import styles from "../CSS/Card.module.css";

const NoteCard = ({note, setShowNotes, setMemory}) => {
  const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);

  const handleDelete = (event) => {
    event.stopPropagation();

    setMemory(currMemory => {
      const newMemory = {...currMemory};
      const updatedNotes = [...newMemory.notes];

      const index = updatedNotes.reduce((acc, item, index) => {
        const isMatch = Object.keys(note).every(key => {
          if (Array.isArray(note[key])) {
            return note[key].every(tag => item[key].includes(tag));
          }
          return item[key] === note[key];
        });
        return isMatch ? index : acc;
      }, -1);

      updatedNotes.splice(index, 1);
      newMemory.notes = updatedNotes;
      console.log(newMemory);
      return newMemory;
    })
  }
  return (
    <div className={`${styles["card-container"]} ${styles["note-card-container"]}`} onClick={()=> {setShowAdditionalDetails(!showAdditionalDetails); console.log("CLICKED" + note.note)}}>
      <div className={styles["header-container"]}>

        <p className={styles["note-main-text"]}>{note.note}</p>
        <div className={styles["icon-container"]}>

          <span className={styles["trash-icon"]} onClick={(event) => {handleDelete(event)}}>&#128465;</span>
          <span className={`${!showAdditionalDetails ? styles["note-down-arrow"] : styles["note-up-arrow"]}`} ></span>

        </div>

      </div>


      { showAdditionalDetails &&
        <><p className={styles["additional-notes"]}>{note.additional_info}</p>

        <p className={styles["tags"]}> Categories: {note.tags.map((tag) => tag)} </p></>}
    </div>
  );
};

export default NoteCard;
