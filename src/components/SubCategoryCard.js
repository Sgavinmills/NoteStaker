import React from 'react';
import styles from "../CSS/Card.module.css";
import { useState, useRef, useEffect } from 'react';
import NoteList from './NoteList';
import MoreOptions from './MoreOptions';
import ConfirmModal from "./ConfirmModal";
import EditCategoryModal from './EditCategoryModal';

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
      const newMemory = {...currMemory};
      const newNotes = [...newMemory.notes];
      const timeStamp = new Date().getTime();
      const randomNumber = Math.random().toString(36).slice(2,9);
      const uniqueIdentifier = String(timeStamp) + randomNumber;
      newNotes.unshift({
        "note" : "",
        "tags" : [{"name" : parentCategory.name, "sub_tags" : [subCategoryName] }],
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

  const removeSubCategory = () => {
    setConfirmDeleteCategoryModalOpen(false);
     setMemory(currMemory => {
      const newMemory = {...currMemory}
      const newNotes = [...newMemory.notes];
      const newCategories = [...newMemory.categories];

      // const catIndex = newCategories.indexOf(parentCategory.name);
      const catIndex = newCategories.reduce((acc, category, index) => {
        const isMatch = category.name === parentCategory.name;
        return isMatch ? index : acc;
      }, -1);

      // newCategories.splice(catIndex, 1);

      const subCatIndex = newCategories[catIndex].sub_categories.reduce((acc, subCategory, index) => {
        const isMatch = subCategory === subCategoryName;
        return isMatch ? index : acc;
      }, -1)

      const newSubCategories = [...newCategories[catIndex].sub_categories];
      newSubCategories.splice(subCatIndex, 1);

      newCategories[catIndex].sub_categories = newSubCategories;


      newMemory.categories = newCategories;


      // const notesWithParentCategory = newNotes.filter(note => note.tags.some(tag => tag.name === parentCategory));

      const filteredNotes = [];

      newNotes.forEach(note => {
        // check if the tags array contains a cat object with the name === parentCategory. 
        // if it does not can just push striahgt into filteredNotes and move on.

        // but if it does have name === parentCategory, then using the index already established, 
        // access that object and see if sub_tags contains subCategoryName.
        // if it does splice it out then push unless it is the only sub category in which case just forget about him
        // if not then just push 

        const catIndex = note.tags.reduce((acc, category, index) => {
          const isMatch = category.name === parentCategory.name;
          return isMatch ? index : acc;
        }, -1)

        if (catIndex === -1) {
          filteredNotes.push(note);
        } else {
          const subCatIndex = note.tags[catIndex].sub_tags.includes(subCategoryName);
          if (subCatIndex === -1) {
            filteredNotes.push(note);
          } else {
            if (note.tags[catIndex].sub_tags.length > 1) {
              note.tags[catIndex].sub_tags.splice(subCatIndex,1);
              // make this new obj first.
              const newNoteSubTags = [...note.tags[catIndex].sub_tags];
              note.tags[catIndex].sub_tags = newNoteSubTags;
              filteredNotes.push(note);
            }
          }
        }
      })

      
      newMemory.notes = filteredNotes;
      return newMemory;

     })

  }

  const removeAllNotesFromCategory = () => {
    // new method:
    // need to loop over notes. Notes with an object in the tag array with name === category.name
    // then check if the corresponding sub tags is empty. if empty then need to remove the paent category from this note
    // and if its the only one in there so tags is now empty then delete the entire note.
    setConfirmDeleteAllNotesWithinCategoryModalOpen(false);
    setMemory(currMemory => {
      const newMemory = {...currMemory};
      const newNotes = [...newMemory.notes];



      const filteredNotes = [];
      debugger;
      newNotes.forEach(note => {
        const catIndex = note.tags.reduce((acc, category, index) => {
          const isMatch = category.name === parentCategory.name;
          return isMatch ? index : acc;
        }, -1)
        
        if (catIndex === -1) {
          filteredNotes.push(note);
        } else {
          const subCatIndex = note.tags[catIndex].sub_tags.includes(subCategoryName);
          if (subCatIndex === -1) {
            filteredNotes.push(note);
          } else {
            if (note.tags[catIndex].sub_tags.length > 1) {
              note.tags[catIndex].sub_tags.splice(subCatIndex,1);
              // make this new obj first.
              const newNoteSubTags = [...note.tags[catIndex].sub_tags];
              note.tags[catIndex].sub_tags = newNoteSubTags;
              filteredNotes.push(note);
            }
          }
        }
      })

      // newNotes.forEach(note => {
      //   const tagIndex = note.tags.indexOf(categoryName);
      //   if (tagIndex === -1) {
      //     filteredNotes.push(note);
      //   } else {
      //     if (note.tags.length > 1) {
      //       note.tags.splice(tagIndex, 1)
      //       filteredNotes.push(note);
      //     }
      //   }
      // })
      newMemory.notes = filteredNotes;
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
