import React from 'react';
import styles from "../CSS/Card.module.css";
import { useState } from 'react';
import NoteList from './NoteList';
import NewAddNoteForm from './NewAddNoteForm';

const CategoryCard = ({categoryName, memory, setMemory}) => {
  const [showNotes, setShowNotes] = useState(false);
  const [addNote, setAddNote] = useState(false);

  // const handleAddNoteClick = (event) => {
  //   event.stopPropagation();
  //   setAddNote(!addNote);
  // }

  const handleAddNoteClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setMemory(currMemory => {
      const newMemory = {...currMemory};
      const newNotes = [...newMemory.notes];
      const timeStamp = new Date().getTime();
      const randomNumber = Math.random().toString(36).slice(2,9);
      const uniqueIdentifier = String(timeStamp) + randomNumber;
      newNotes.unshift({
        "note" : "",
        "tags" : [categoryName],
        "additional_info" : "",
        "date_added" : "",
        id : uniqueIdentifier
      });
      newMemory.notes = newNotes;
      return newMemory;
    })

    setShowNotes(true);
  }
  
  return (
    <>
    <div className={`${styles["card-container"]} ${styles["category-card-container"]}`} onClick={()=> {setShowNotes(!showNotes)}}>
      <div className={styles["category-contents-container"]}>
          <p className={styles["category-main-text"]}>{categoryName}</p>
          <div className={styles["category-icon-container"]}>
            <span className={`${styles["category-plus-symbol"]}`} onClick={(event) => {handleAddNoteClick(event)}} >&#x002B;</span>
            <span className={`${!showNotes ? styles["category-down-arrow"] : styles["category-up-arrow"]}`} ></span>

          </div>
      </div>
    </div>

    {addNote && <NewAddNoteForm setMemory={setMemory} setShowAddNoteForm={setAddNote} directToCategory={categoryName}/>  }
    {showNotes && <NoteList memory={memory} categoryName={categoryName} setMemory={setMemory} />}
    </>
  );
};

export default CategoryCard;