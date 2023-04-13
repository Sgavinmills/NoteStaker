import React, { useState } from 'react';
import ModalStyles from "../CSS/Modal.module.css";

const EditCategoryModal = ({setEdittingCategory, currCategoryName, setMemory, memory}) => {
const [categoryText, setCategoryText] = useState(currCategoryName);

const handleSubmit = (event) => {
  event.stopPropagation();
  event.preventDefault();
  setEdittingCategory(false);
  if (!memory.categories.includes(categoryText) && categoryText.length > 2) {
    setMemory(currMemory => {
      const newMemory = {...currMemory};
      const newCategories = [...newMemory.categories];
      const catIndex = newCategories.indexOf(currCategoryName);
      newCategories[catIndex] = categoryText;
      newMemory.categories = newCategories;

      // loop over notes
      // if note.tag contains currcategoryname then change it

      const newNotes = [...newMemory.notes];
      const updatedNotes = newNotes.map(note => {
        const tagIndex = note.tags.indexOf(currCategoryName);
        if (tagIndex > -1) {
          note.tags[tagIndex] = categoryText;
        }

        return note;
      })

      newMemory.notes = updatedNotes;
      return newMemory;
    })
  } else {
    alert("already a category with that name, sos");
  }
}

const handleCancel = (event) => {
  event.stopPropagation();
  event.preventDefault();
  setEdittingCategory(false);
}
  return (
    <div className={`${ModalStyles["add-category-modal-container"]} ${ModalStyles[""]}`}>
     <div className={`${ModalStyles["add-category-modal-content"]}`}>
      <div className={`${ModalStyles["add-category-modal-message"]}`}>
        <p>Enter category name</p>
          
        <input onChange={(event) => setCategoryText(event.target.value)}
          value={categoryText}
        
        />
      </div>
      <div className={`${ModalStyles["add-category-modal-options"]}`}>
        <button className={`${ModalStyles["add-category-modal-option"]}`} onClick={(event) => {handleSubmit(event)}}>Submit</button>
        <button className={`${ModalStyles["add-category-modal-option"]}`} onClick={(event) => {handleCancel(event)}}>Cancel</button>
    </div>

     </div>
    </div>
  );
};

export default EditCategoryModal;
