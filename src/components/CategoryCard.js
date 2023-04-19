import React from 'react';
import styles from "../CSS/Card.module.css";
import { useState, useRef, useEffect } from 'react';
import NoteList from './NoteList';
import SubCategories from './SubCategories';
import MoreOptions from './MoreOptions';
import ConfirmModal from "./ConfirmModal";
import EditCategoryModal from './EditCategoryModal';
import AddCategoryModal from './AddCategoryModal';

const CategoryCard = ({category, memory, setMemory, isFocussedCannotClick, setIsFocussedCannotClick}) => {

  const [showNotes, setShowNotes] = useState(false);
  const [showSubCategories, setShowSubCategories] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [confirmDeleteCategoryModalOpen, setConfirmDeleteCategoryModalOpen] = useState(false);
  const [confirmDeleteAllNotesWithinCategoryModalOpen, setConfirmDeleteAllNotesWithinCategoryModalOpen] = useState(false)
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [edittingCategory, setEdittingCategory] = useState(false);
  const [addingSubCategory, setAddingSubCategory] = useState(false);

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
        "tags" : [{"name" : category.name, "sub_tags" : []}],
        "additional_info" : "",
        "date_added" : "",
        id : uniqueIdentifier,
        newEmptyNote : true
      });
      newMemory.notes = newNotes;
      return newMemory;
    })

    setShowNotes(true); // so im praying that here i can do some shit where i creare a useRef and apply it in the <Note component
    // if the newEmptyNote property is true. Then, after setting to memory here i can do targetRef.current.scrollIntoView (s per chatgpt)
    // to head to it. prob worth doing sharpish after getting subcategory list to render nicely. 

    // either that or we'll need to just make a new form component that looks like a note that we can render above the subcategory list
    // to add a note without categories,. 

    // for now i 'll just update this to add a blank note as before into the category. and it will appear underneath sub categories for time being. 
  }

  const removeCategory = () => {
    setConfirmDeleteCategoryModalOpen(false);
     setMemory(currMemory => {
      const newMemory = {...currMemory}
      const newNotes = [...newMemory.notes];
      const newCategories = [...newMemory.categories];

      // const catIndex = newCategories.indexOf(categoryName);
      let catIndex = -1;
      for (let i = 0; i < newCategories.length; i++) {
        if (newCategories[i.name === category.name]) {
          catIndex = i;
          break;
        }
      }
      newCategories.splice(catIndex, 1);
      newMemory.categories = newCategories;

      const filteredNotes = [];
      // newNotes.forEach(note => {
      //   const tagIndex = note.tags.indexOf(categoryName);
      //   if (tagIndex === -1) {
      //     filteredNotes.push(note);
      //   } else {
      //     if (note.tags.length > 1) {
      //       // splce then push
      //       note.tags.splice(tagIndex, 1)
      //       filteredNotes.push(note);
      //     }
      //   }
      // })

      newNotes.forEach(note => {
        let tagIndex = -1;
        for (let i = 0; i < note.tags.length; i++) {
          if (note.tags[i].name === category.name) {
            tagIndex = i;
            break;
          }
        }
        if (tagIndex === -1) {
          filteredNotes.push(note);
        } else {
          if (note.tags.length > 1) {
            note.tags.splice(tagIndex, 1)
            filteredNotes.push(note);
          }
        }
      })
      newMemory.notes = filteredNotes;
      return newMemory;

     })

  }

  const removeAllNotesFromCategory = () => {
    setConfirmDeleteAllNotesWithinCategoryModalOpen(false);
    setMemory(currMemory => {
      const newMemory = {...currMemory};
      const newNotes = [...newMemory.notes];
      const filteredNotes = [];
      newNotes.forEach(note => {
        // const tagIndex = note.tags.indexOf(categoryName);
        let tagIndex = -1;
        for (let i = 0; i < note.tags.length; i++) {
          if (note.tags[i] === category.name) {
            tagIndex = i;
            break;
          }
        }
        if (tagIndex === -1) {
          filteredNotes.push(note);
        } else {
          if (note.tags.length > 1) {
            note.tags.splice(tagIndex, 1)
            filteredNotes.push(note);
          }
        }
      })
      newMemory.notes = filteredNotes;
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
    {edittingCategory && (
      <EditCategoryModal setEdittingCategory={setEdittingCategory} currCategoryName={category.name} setMemory={setMemory} memory={memory}  />
    )}
    { addingSubCategory && <AddCategoryModal setAddingCategory={setAddingSubCategory} memory={memory} setMemory={setMemory} parentCategory={category} />}

    <div className={`${styles["card-container"]} ${styles["category-card-container"]}`} onMouseDown={()=> { handleCategoryCardClick()}}>
      <div className={styles["category-contents-container"]}>
      <p className={styles["category-main-text"]}>{category.name}
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
