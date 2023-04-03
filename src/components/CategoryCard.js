import React from 'react';
import styles from "../CSS/Card.module.css";
import { useState, useEffect } from 'react';
import NoteList from './NoteList';
const CategoryCard = ({categoryName, memory}) => {

  const [showNotes, setShowNotes] = useState(false);
  return (
    <>
    <div className={styles["card-container"]} onClick={()=> {setShowNotes(!showNotes)}}>
      <p className={styles["main-text"]}>{categoryName}</p>
    </div>

    {showNotes && <NoteList memory={memory} categoryName={categoryName} />}
    </>
  );
};

export default CategoryCard;