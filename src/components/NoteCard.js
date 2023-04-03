import React from 'react';
import styles from "../CSS/Card.module.css";

const NoteCard = ({mainText, additionalText, setShowNotes}) => {
  return (
    <div className={styles["card-container"]} onClick={()=> {setShowNotes(true)}}>
      <p className={styles["main-text"]}>{mainText}</p>

      {additionalText && 
        <p className={styles["additional-notes"]}>Additional notes here</p>}
    </div>
  );
};

export default NoteCard;
