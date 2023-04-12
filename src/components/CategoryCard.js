import React from 'react';
import styles from "../CSS/Card.module.css";
import { useState, useRef } from 'react';
import NoteList from './NoteList';
import ConfirmModal from './ConfirmModal';

const CategoryCard = ({categoryName, memory, setMemory}) => {
  const textareaRef = useRef(null); // Create a ref to the textarea element

  const [showNotes, setShowNotes] = useState(false);
  const [touchTimeout, setTouchTimeout] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [edittingCategory, setEdittingCategory] = useState(false);
  const [categoryNameText, setCategoryNameText] = useState(categoryName);

  const confirmationMessage = "Are you sure? Entire category will be deleted. Any notes not in other categories cannot be recovered";
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

  const handleTouchStart = (event, touchType, categoryName) => {
    if (!touchTimeout) {
      setTouchTimeout(true);
      setTimeout(() => {
        switch (touchType) {
          case "edit":
            handleEdit(event);
            break;
          case "delete":
            handleDelete(event);
            break;
          case "done":
            handleDoneEditting(event);
            break;
          default:
            break;
        }
      }, 200)
    }
  }

  const handleEdit = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setEdittingCategory(!edittingCategory);
    textareaRef.current?.focus();
    const textArea = textareaRef.current;
    textArea?.setSelectionRange(textArea.value.length, textArea.value.length);





  }

  const handleDelete = (event) => {
    event.stopPropagation();
    event.preventDefault();

    setShowConfirmDeleteModal(true);

  }

  const deleteCategory = () => {
    setShowConfirmDeleteModal(false);
    setMemory(currMemory => {
      const newMemory = {...currMemory};
      const newNotes = [...newMemory.notes];
      const newCategories = [...newMemory.categories];

      const indexOfCategory = newCategories.indexOf(categoryName);
      newCategories.splice(indexOfCategory, 1);
      newMemory.categories = newCategories;

      const updatedNotes = [];
      newNotes.forEach((note) => {
        const index = note.tags.indexOf(categoryName)
        if (index > -1) {
          note.tags.splice(index, 1);

        } 
        if (note.tags.length > 0) {
          updatedNotes.push(note);
        }
        
      })      
      newMemory.notes = updatedNotes;
      return newMemory;
    })
  }

  const handleBlur = (event) => {
    // maybe dont care about blur actually? a submit button will be better here..
    console.log("blurrred from category edit")
    setEdittingCategory(false);
    setCategoryNameText(categoryName);
  }

  const handleChange = (event) => {
    setCategoryNameText(event.target.value);
  }

  const handleDoneEditting = (event) => {
    console.log("dont think im doing thi")
    event.preventDefault();
    event.stopPropagation();
    // for now will reuse the 'add category' modal to edit
    // so set some variable to true so that pops up do shizz with it
    // on submit...

    // find item in category array of memory and edit it
    // then go through every note and if the note has that category need to edit there as well
    setMemory(currMemory => {
      const newMemory = {...currMemory};
      const newNotes = [...newMemory.notes];
      const newCategories = [...newMemory.categories];

      const indexOfCategory = newCategories.indexOf(categoryName);
      // newCategories.splice(indexOfCategory, 1);
      newCategories[indexOfCategory] = categoryNameText;
      newMemory.categories = newCategories;

      newNotes.forEach((note) => {
        const index = note.tags.indexOf(categoryName)
        if (index > -1) {
          note.tags[index] = categoryNameText;

        } 
        
      })      
      newMemory.notes = newNotes;
      return newMemory;
    })
    setEdittingCategory(false);
  }
  
  return (
    <>
    {showConfirmDeleteModal && <ConfirmModal handleDelete={deleteCategory} setIsModalOpen={setShowConfirmDeleteModal} confirmationMessage={confirmationMessage}/>}
    <div className={`${styles["card-container"]} ${styles["category-card-container"]}`} onClick={()=> {setShowNotes(!showNotes)}}>
      <div className={styles["category-contents-container"]}>
              { !edittingCategory ? 
               <p className={styles["category-main-text"]}>{categoryName}
               {/* {showNotes && <span className={styles["edit-icon"]} onTouchStart={(event) => {handleTouchStart(event, "edit")}} onMouseDown={(event) => {handleEdit(event)}}>&#x270F;</span>} */}
               {/* {showNotes && <span className={styles["trash-icon"]} onTouchStart={(event) => {handleTouchStart(event, "delete")}} onMouseDown={(event) => {handleDelete(event)}}>&#x1F5D1;</span>} */}
               </p>
               :<div> <textarea 
               ref={textareaRef}
               className={styles["category-edit-text-area"]}
               value={categoryNameText}
               onBlur={(event) => { handleBlur(event)}}
               onChange={(event) => { handleChange(event)}}
               onClick={(event) => {event.stopPropagation()}}
               /> 
               <span className={styles["done-editting-icon"]} onMouseDown={(event) => { handleDoneEditting(event)}} onTouchStart={event => {handleTouchStart(event, "done")}}>&#x2713;</span>
               </div>
               }
          <div className={styles["category-icon-container"]}>
            <span className={`${styles["category-plus-symbol"]}`} onClick={(event) => {handleAddNoteClick(event)}} >&#x002B;</span>
            <span className={`${!showNotes ? styles["category-down-arrow"] : styles["category-up-arrow"]}`} ></span>

          </div>
      </div>
    </div>

    {showNotes && <NoteList memory={memory} categoryName={categoryName} setMemory={setMemory} />}
    </>
  );
};

export default CategoryCard;