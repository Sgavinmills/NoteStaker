import React from 'react';
import styles from "../CSS/Card.module.css";
import { useState, useRef, useEffect } from 'react';
import NoteList from './NoteList';
import MoreOptions from './MoreOptions';
const CategoryCard = ({categoryName, memory, setMemory, isFocussedCannotClick, setIsFocussedCannotClick}) => {

  const [showNotes, setShowNotes] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const optionsMenuRef = useRef(null);

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
        id : uniqueIdentifier,
        newEmptyNote : true
      });
      newMemory.notes = newNotes;
      return newMemory;
    })

    setShowNotes(true);
  }

  const optionNotHandled = () => {
    console.log("This option is not handled yet");
  }
  const options = [
    {
      option: "Delete category",
      action: optionNotHandled
    },
    {
      option: "Edit category",
      action: optionNotHandled
    },
    {
      option: "Remove all notes from category",
      action: optionNotHandled
    }
  ]

  const handleMoreOptionsClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setShowMoreOptions(!showMoreOptions)
  }

  const handleOutsideClick = (event) => { // checks for clicks outside the more options box
    if (
      optionsMenuRef.current &&
      !optionsMenuRef.current.contains(event.target)
    ) {
      event.preventDefault();
      event.stopPropagation();
      setShowMoreOptions(false);
    }
  };

  useEffect(() => {
    if (showMoreOptions) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showMoreOptions]);
  
  const handleCategoryCardClick = () => {
    if (optionsMenuRef.current) {
      return;
    }
    if(!isFocussedCannotClick) { setShowNotes(!showNotes)}
  }
  return (
    <>
    <div className={`${styles["card-container"]} ${styles["category-card-container"]}`} onMouseDown={()=> { handleCategoryCardClick()}}>
      <div className={styles["category-contents-container"]}>
      <p className={styles["category-main-text"]}>{categoryName}
      </p>
          <div className={styles["category-icon-container"]}>
            <span className={`${styles["category-plus-symbol"]}`} onClick={(event) => {handleAddNoteClick(event)}} >&#x002B;</span>
            <span className={`${!showNotes ? styles["category-down-arrow"] : styles["category-up-arrow"]}`} ></span>
            <span className={styles["category-three-vertical-dots-icon"]} onMouseDown={(event) => {handleMoreOptionsClick(event)}}>&#x22EE;
                     {showMoreOptions && <MoreOptions options={options} optionsMenuRef={optionsMenuRef} />}
          </span>
          </div>
      </div>
    </div>

    {showNotes && <NoteList isFocussedCannotClick={isFocussedCannotClick} setIsFocussedCannotClick={setIsFocussedCannotClick} memory={memory} categoryName={categoryName} setMemory={setMemory} />}
    </>
  );
};

export default CategoryCard;