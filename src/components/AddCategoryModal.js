import React, { useState } from 'react';
import ModalStyles from "../CSS/Modal.module.css";
import { addParentCategoryToMemory, addSubCategoryToMemory, getParentCategoryIndex } from '../memoryFunctions/memoryFunctions';

const AddCategoryModal = ({setAddingCategory, setMemory, memory, parentCategory, setShowSubCategories}) => {
const [categoryText, setCategoryText] = useState('');

// checks if the new subcategory is the first in a parent and if so if any notes will be moved
const strandedNotes = () => {
  if (parentCategory && parentCategory.sub_categories.length === 0) {
    return memory.notes.some(note => getParentCategoryIndex(note.tags, parentCategory.name) > -1);
  }
  return false;
}

const handleSubmit = (event) => {
  event.stopPropagation();
  event.preventDefault();
  setAddingCategory(false);
  if(setShowSubCategories) {
    setShowSubCategories(true);
  }
  // should display a reason why can't add
  if (!parentCategory) { // add normal category
    if (!memory.categories.some(cat => cat === categoryText) && categoryText.length > 2) {
      setMemory(currMemory => {
         const newMemory = addParentCategoryToMemory(currMemory, categoryText)
        return newMemory;
      })
    }

  } else { // add sub category
  // should display a reason why can't add
    const parentCatIndex = getParentCategoryIndex(memory.categories, parentCategory.name);
    if (!memory.categories[parentCatIndex].sub_categories.includes(categoryText) && categoryText.length > 2) {
      setMemory(currMemory => {
        const newMemory = addSubCategoryToMemory(currMemory, categoryText, parentCatIndex);
        return newMemory;
      })
    }
  }
}

const handleCancel = (event) => {
  event.stopPropagation();
  event.preventDefault();
  setAddingCategory(false);
}
  return (
    <div className={`${ModalStyles["add-category-modal-container"]} ${ModalStyles[""]}`}>
     <div className={`${ModalStyles["add-category-modal-content"]}`}>
      <div className={`${ModalStyles["add-category-modal-message"]}`}>
        <p>Enter category name</p>
        { strandedNotes() && <p className={`${ModalStyles["additional-info-message"]}`} >If a category has a sub-category then all notes within that category must reside in a subcategory.
          Since notes already exist in {parentCategory.name} they will all be moved into the new sub category after it is created. You can still move them into different categories later.</p>}
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

export default AddCategoryModal;
