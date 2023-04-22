import React from 'react';
import styles from "../CSS/Card.module.css";
import { useState, useRef, useEffect } from 'react';
import NoteList from './NoteList';
import SubCategories from './SubCategories';
import MoreOptions from './MoreOptions';
import ConfirmModal from "./ConfirmModal";
import EditCategoryModal from './EditCategoryModal';
import MoveCategoryArrows from './MoveItemArrows';
import AddCategoryModal from './AddCategoryModal';
import { addNewBlankNoteToParentCategory, removeParentCategory, removeAllNotesFromParentCategory, getParentCategoryIndex, moveCategoryUp, moveCategoryDown } from '../memoryFunctions/memoryFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpDown } from '@fortawesome/free-solid-svg-icons'
const CategoryCard = ({category, memory, setMemory, isFocussedCannotClick, setIsFocussedCannotClick}) => {

  const [showNotes, setShowNotes] = useState(false);
  const [showSubCategories, setShowSubCategories] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [confirmDeleteCategoryModalOpen, setConfirmDeleteCategoryModalOpen] = useState(false);
  const [confirmDeleteAllNotesWithinCategoryModalOpen, setConfirmDeleteAllNotesWithinCategoryModalOpen] = useState(false)
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [edittingCategory, setEdittingCategory] = useState(false);
  const [addingSubCategory, setAddingSubCategory] = useState(false);
  const [movingCategory, setMovingCategory] = useState(false);
  const optionsMenuRef = useRef(null);
  const handleAddNoteClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setMemory(currMemory => {
      const newMemory = addNewBlankNoteToParentCategory(currMemory, category.name);
      return newMemory;
    })
    setShowNotes(true); 
  }

  const removeCategory = () => {
    setConfirmDeleteCategoryModalOpen(false);
     setMemory(currMemory => {
      const newMemory = removeParentCategory(currMemory, category.name);
      return newMemory;
     })
  }

  const removeAllNotesFromCategory = () => {
    setConfirmDeleteAllNotesWithinCategoryModalOpen(false);
    setMemory(currMemory => {
      const newMemory = removeAllNotesFromParentCategory(currMemory, category.name);
      return newMemory;
    })
  }
  
  const handleDeleteCategoryClick = (event) => {
    setConfirmDeleteCategoryModalOpen(true);
    setConfirmationMessage("Are you sure you want to delete this category? Any notes that only belong to this category will also be deleted.")
  }

  const handleDeleteAllNotesWithinCategoryClick = (event) => {
    setConfirmDeleteAllNotesWithinCategoryModalOpen(true);
    setConfirmationMessage("Are you sure you want to delete all notes within this category? Notes belonging to other categories will remain there but the rest will be permenantly erased")
  }

  const handleEditCategoryClick = () => {
    setEdittingCategory(true);
  }

  const handleAddSubCategoryClick = () => {
    setAddingSubCategory(true);
  }

  const handleMoveCategoryClick = () => {
    setMovingCategory(true);
  }
  const options = [
    {
      option: " ➕ Add Sub-Category",
      action: handleAddSubCategoryClick
    },
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
    },
    {
      option: <span> <FontAwesomeIcon size="lg" icon={faUpDown} /> Move category</span>,
      action: handleMoveCategoryClick
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
    if(!isFocussedCannotClick) { 
      setShowSubCategories(!showSubCategories)
      setShowNotes(!showNotes)
    }
  }

const handleMoveCategoryUp = (event, catName) => {
  event.stopPropagation();
  event.preventDefault();

  const catIndex = getParentCategoryIndex(memory.categories, catName);
  if (catIndex === 0) {
    // handle not being able to move up here.
    // dont do until note moving is implemented because that might be a pickler
    return;
  }

  setMemory(currMemory => {
    const newMemory = moveCategoryUp(currMemory, catIndex);
    return newMemory;
    })
}

const handleMoveCategoryDown = (event, catName) => {
  event.stopPropagation();
  event.preventDefault();
  const catIndex = getParentCategoryIndex(memory.categories, catName);
  if (catIndex === memory.categories.length -1) {
    console.log("already at bottom")
    // handle not moving here, but wait til notes is done
    return;
  }
  setMemory(currMemory => {
    const newMemory = moveCategoryDown(currMemory, catIndex);
    return newMemory;
    })
}
  
  return (
    <>
    {confirmDeleteCategoryModalOpen && (
        <ConfirmModal
          handleDelete={removeCategory}
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
      <MoveCategoryArrows handleUp={handleMoveCategoryUp} handleDown={handleMoveCategoryDown}memory={memory} setMemory={setMemory} itemName={category.name} setMovingItem={setMovingCategory}/>
    }
    {edittingCategory && (
      <EditCategoryModal setEdittingCategory={setEdittingCategory} currCategoryName={category.name} setMemory={setMemory} memory={memory}  />
    )}
    { addingSubCategory && <AddCategoryModal setShowSubCategories={setShowSubCategories} setAddingCategory={setAddingSubCategory} memory={memory} setMemory={setMemory} parentCategory={category} />}

    <div className={`${styles["card-container"]} ${styles["category-card-container"]}`} onMouseDown={()=> { handleCategoryCardClick()}}>
      <div className={styles["category-contents-container"]}>
      <p className={styles["category-main-text"]}>{category.name}
      </p>
          <div className={styles["category-icon-container"]}>
           {(memory.categories.find(cat => cat.name === category.name)?.sub_categories.length === 0) && <span className={`${styles["category-plus-symbol"]}`} onClick={(event) => {handleAddNoteClick(event)}} >&#x002B;</span>}
            <span className={`${!showNotes ? styles["category-down-arrow"] : styles["category-up-arrow"]}`} ></span>
            <span className={styles["category-three-vertical-dots-icon"]} onMouseDown={(event) => {handleMoreOptionsClick(event)}}>&#x22EE;
                     {showMoreOptions && <MoreOptions options={options} optionsMenuRef={optionsMenuRef} />}
          </span>
          </div>
      </div>
    </div>
      {/* showSubcategories - list the sub categrories.
      then the showNotes bit would filter for notes in the category name that do NOT have a sub category. 
      the subcategory component would be passed the name of the sub catgeoy and the parents category
      then the notes themselves would be rendered in a similar way as before, check all notes if they have a tag
      that has [0] matching category then check if it has a [1] that includes sub category and render.
       */}
    { showSubCategories && <SubCategories memory={memory} setMemory={setMemory} parentCategory={category} isFocussedCannotClick={isFocussedCannotClick} setIsFocussedCannotClick={setIsFocussedCannotClick}/>}
    {showNotes && <NoteList isFocussedCannotClick={isFocussedCannotClick} setIsFocussedCannotClick={setIsFocussedCannotClick} memory={memory} parentCategory={category} setMemory={setMemory} />}
    </>
  );
};

export default CategoryCard;

// editting and deleteing not so bad since we just need to use uniqueid to find them
