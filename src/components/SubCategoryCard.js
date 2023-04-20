import React from 'react';
import styles from "../CSS/Card.module.css";
import { useState, useRef, useEffect } from 'react';
import NoteList from './NoteList';
import MoreOptions from './MoreOptions';
import ConfirmModal from "./ConfirmModal";
import EditCategoryModal from './EditCategoryModal';
import { addNewBlankNoteToSubCategory, removeAllNotesFromASubCategory, removeSubCategoryFromMemory } from '../memoryFunctions/memoryFunctions';

const SubCategoryCard = ({subCategoryName, parentCategory, memory, setMemory, isFocussedCannotClick, setIsFocussedCannotClick}) => {

  const [showNotes, setShowNotes] = useState(false);
  const [showSubCategories, setShowSubCategories] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [confirmDeleteCategoryModalOpen, setConfirmDeleteCategoryModalOpen] = useState(false);
  const [confirmDeleteAllNotesWithinCategoryModalOpen, setConfirmDeleteAllNotesWithinCategoryModalOpen] = useState(false)
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [edittingCategory, setEdittingCategory] = useState(false);
  const optionsMenuRef = useRef(null);

  const handleAddNoteClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setMemory(currMemory => {
      const newMemory = addNewBlankNoteToSubCategory(currMemory, subCategoryName, parentCategory.name)
      return newMemory;
    })

    setShowNotes(true);
  }


  const removeSubCategory = () => {
    setConfirmDeleteCategoryModalOpen(false);
     setMemory(currMemory => {
      const newMemory = removeSubCategoryFromMemory(currMemory, subCategoryName, parentCategory.name)
      return newMemory;
     })

  }

  const removeAllNotesFromCategory = () => {
    setConfirmDeleteAllNotesWithinCategoryModalOpen(false);
    setMemory(currMemory => {
      const newMemory = removeAllNotesFromASubCategory(currMemory, subCategoryName, parentCategory.name);
      return newMemory;
      
    })
  }
  
  const handleDeleteCategoryClick = (event) => {
    setConfirmDeleteCategoryModalOpen(true);
    setConfirmationMessage("Are you sure you want to delete this sub category? Any notes that only belong to this category will also be deleted.")
  }

  const handleDeleteAllNotesWithinCategoryClick = (event) => {
    setConfirmDeleteAllNotesWithinCategoryModalOpen(true);
    setConfirmationMessage("Are you sure you want to delete all notes within this sub category? Notes belonging to other categories will remain there but the rest will be permenantly erased")
  }

  const handleEditCategoryClick = () => {
    setEdittingCategory(true);
  }

  const options = [
    {
      option: " ❌ Delete category",
      action: handleDeleteCategoryClick
    },
    {
      option: "✏️ Edit category name",
      action: handleEditCategoryClick
    },
    {
      option: "🗑️ Remove all notes from category",
      action: handleDeleteAllNotesWithinCategoryClick
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
  
  const handleSubCategoryCardClick = () => {
    if (optionsMenuRef.current) {
      return;
    }

    if(!isFocussedCannotClick) { 
      setShowSubCategories(!showSubCategories)
      setShowNotes(!showNotes)
    }
  }
  return (
    <>
    {confirmDeleteCategoryModalOpen && (
        <ConfirmModal
          handleDelete={removeSubCategory}
          setIsModalOpen={setConfirmDeleteCategoryModalOpen}
          confirmationMessage={confirmationMessage}
        />
      )}
    {confirmDeleteAllNotesWithinCategoryModalOpen && (
        <ConfirmModal
          handleDelete={removeAllNotesFromCategory}
          setIsModalOpen={setConfirmDeleteAllNotesWithinCategoryModalOpen}
          confirmationMessage={confirmationMessage}
        />
      )}
    {edittingCategory && (
      <EditCategoryModal setEdittingCategory={setEdittingCategory} currCategoryName={subCategoryName} setMemory={setMemory} memory={memory} subCategoryName={subCategoryName} parentCategory={parentCategory}  />
    )}
    <div className={`${styles["card-container"]} ${styles["sub-category-card-container"]}`} onMouseDown={()=> { handleSubCategoryCardClick()}}>
      <div className={styles["category-contents-container"]}>
      <p className={styles["sub-category-main-text"]}>↳ {subCategoryName}
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

    {showNotes && <NoteList isFocussedCannotClick={isFocussedCannotClick} setIsFocussedCannotClick={setIsFocussedCannotClick} memory={memory} parentCategory={parentCategory} subCategoryName={subCategoryName} setMemory={setMemory} />}
    </>
  );
};

export default SubCategoryCard;

// editting and deleteing not so bad since we just need to use uniqueid to find them
