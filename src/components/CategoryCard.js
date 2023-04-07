import React from 'react';
import styles from "../CSS/Card.module.css";
import { useState } from 'react';
import NoteList from './NoteList';
const CategoryCard = ({categoryName, memory, setMemory}) => {
  const [showNotes, setShowNotes] = useState(false);
  
  return (
    <>
    <div className={`${styles["card-container"]} ${styles["category-card-container"]}`} onClick={()=> {setShowNotes(!showNotes)}}>
      <div className={styles["header-container"]}>
      <p className={styles["category-main-text"]}>{categoryName}</p>
      <span className={`${!showNotes ? styles["category-down-arrow"] : styles["category-up-arrow"]}`} ></span>
      </div>
    </div>

    {showNotes && <NoteList memory={memory} categoryName={categoryName} setMemory={setMemory} />}
    </>
  );
};

export default CategoryCard;