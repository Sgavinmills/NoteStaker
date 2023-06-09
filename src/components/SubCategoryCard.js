import React from 'react';
import styles from "../CSS/Card.module.css";
import { useState, useRef, useEffect } from 'react';
import NoteList from './NoteList';
import MoreOptions from './MoreOptions';
import ConfirmModal from "./ConfirmModal";
import EditCategoryModal from './EditCategoryModal';
import { addNewBlankNoteToSubCategory, getParentCategoryIndex, getSubCatIndex, moveSubCategoryDown, moveSubCategoryUp, removeAllNotesFromASubCategory, removeSubCategoryFromMemory } from '../memoryFunctions/memoryFunctions';
import MoveCategoryArrows from './MoveItemArrows';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare, faTrash, faUpDown } from '@fortawesome/free-solid-svg-icons'

const SubCategoryCard = ({subCategoryName, parentCategory, memory, setMemory, isFocussedCannotClick, setIsFocussedCannotClick, closeNotes, setCloseNotes}) => {

  const [showNotes, setShowNotes] = useState(false);
  const [showSubCategories, setShowSubCategories] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [confirmDeleteCategoryModalOpen, setConfirmDeleteCategoryModalOpen] = useState(false);
  const [confirmDeleteAllNotesWithinCategoryModalOpen, setConfirmDeleteAllNotesWithinCategoryModalOpen] = useState(false)
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [edittingCategory, setEdittingCategory] = useState(false);
  const [movingCategory, setMovingCategory] = useState(false);
  const optionsMenuRef = useRef(null);

  useEffect(() => {
    if (closeNotes) {
      setShowNotes(false);
      setCloseNotes(false);
    }
  }, [closeNotes, setShowNotes, setShowSubCategories, setCloseNotes])


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
    setConfirmationMessage(<p>Are you sure you want to delete <span style={{ fontStyle: 'italic', fontWeight: 'bold' }}>{subCategoryName}</span> sub-category? Any notes that only belong to this category will also be deleted.</p>)
  }

  const handleDeleteAllNotesWithinCategoryClick = (event) => {
    setConfirmDeleteAllNotesWithinCategoryModalOpen(true);
    setConfirmationMessage(<p>Are you sure you want to delete all notes within <span style={{ fontStyle: 'italic' , fontWeight: 'bold'}}>{subCategoryName}</span> sub-category? Notes belonging to other categories will remain there but the rest will be permenantly erased</p>)
  }

  const handleEditCategoryClick = () => {
    setEdittingCategory(true);
  }

  const handleMoveCategoryClick = () => {
    setCloseNotes(true);
    setMovingCategory(true);
  }

  const options = [
    {
      option: <span><FontAwesomeIcon icon={faPenToSquare} /> Edit sub-category name</span>,
      action: handleEditCategoryClick
    },
    {
      option: <span> <FontAwesomeIcon icon={faUpDown} /> Move sub-category</span>,
      action: handleMoveCategoryClick
    },
    {
      option: <span><FontAwesomeIcon icon={faTrash} /> Remove all notes from sub-category</span>,
      action: handleDeleteAllNotesWithinCategoryClick
    },
    {
      option: " ❌ Delete sub-category",
      action: handleDeleteCategoryClick
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

  const handleMoveCategoryUp = (event, catName) => {
    event.stopPropagation();
    event.preventDefault();
    const parentCatIndex = getParentCategoryIndex(memory.categories, parentCategory.name);
    const subCatIndex = getSubCatIndex(memory.categories, catName, parentCatIndex) 
    if (subCatIndex === 0) {
      // todo: handle item at top
      return;
    }
  
    setMemory(currMemory => {
      const newMemory = moveSubCategoryUp(currMemory, subCatIndex, parentCatIndex);
      return newMemory;
    })
  }
  
  const handleMoveCategoryDown = (event, catName) => {
    event.stopPropagation();
    event.preventDefault();
    const parentCatIndex = getParentCategoryIndex(memory.categories, parentCategory.name);
    const subCatIndex = getSubCatIndex(memory.categories, catName, parentCatIndex) // THINK this subcatname param should be the catName

    if (subCatIndex === memory.categories[parentCatIndex].sub_categories.length -1) {
      console.log("already at bottom")
      // handle not moving here, but wait til notes is done
      return;
    }
    setMemory(currMemory => {
      const newMemory = moveSubCategoryDown(currMemory, subCatIndex, parentCatIndex);
      return newMemory;
      })
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
    { movingCategory && 
      <MoveCategoryArrows handleUp={handleMoveCategoryUp} handleDown={handleMoveCategoryDown} memory={memory} setMemory={setMemory} itemName={subCategoryName} setMovingItem={setMovingCategory}/>
    }
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

    {(showNotes && !closeNotes) && <NoteList isFocussedCannotClick={isFocussedCannotClick} setIsFocussedCannotClick={setIsFocussedCannotClick} memory={memory} parentCategory={parentCategory} subCategoryName={subCategoryName} setMemory={setMemory} />}
    </>
  );
};

export default SubCategoryCard;

// editting and deleteing not so bad since we just need to use uniqueid to find them
