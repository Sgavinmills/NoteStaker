import React, { useState } from 'react';
import styles from "../CSS/Card.module.css";
import MoreOptions from "./MoreOptions";
import NewAddCategoryForm from "./NewAddCategoryForm"

const AddNoteCard = ({showAddNoteForm, setShowAddNoteForm, memory, setMemory}) => {

  const [addCategory, setAddCategory] = useState(false);
  const handleAddCategoryClick = () => {
    console.log("clicked add category");
    setAddCategory(!addCategory);
  }

  const options = [
    { 
      option: "Add Category",
      action: handleAddCategoryClick,
    }
  ]
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  
  const handleMoreOptionsClick = (event) => {
    event.stopPropagation();
    setShowMoreOptions(!showMoreOptions);
  }
  return (
    <>
    <div className={`${styles["card-container"]} ${styles["add-note-container"]}`} onClick={() => setShowAddNoteForm(!showAddNoteForm)}>
      <p className={styles["main-text"]}>Add Note (+)</p>

      <span className={styles["note-three-vertical-dots-icon"]} onClick={(event) => {handleMoreOptionsClick(event)}}>&#x22EE;
      
     {showMoreOptions && <MoreOptions options={options}/>}
      </span>


    </div>
    {addCategory && <NewAddCategoryForm memory={memory} setMemory={setMemory} setAddCategory={setAddCategory}/>}
    </>
  );
};

export default AddNoteCard;
