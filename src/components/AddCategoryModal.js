import React, { useState } from 'react';
import ModalStyles from "../CSS/Modal.module.css";
import { addParentCategoryToMemory, addSubCategoryToMemory, getParentCategoryIndex } from '../memoryFunctions/memoryFunctions';
const AddCategoryModal = ({setAddingCategory, setMemory, memory, parentCategory}) => {
const [categoryText, setCategoryText] = useState('');

const handleSubmit = (event) => {
  event.stopPropagation();
  event.preventDefault();
  setAddingCategory(false);
  if (!parentCategory) { // add normal category
    if (!memory.categories.some(cat => cat === categoryText) && categoryText.length > 2) {
      setMemory(currMemory => {
         const newMemory = addParentCategoryToMemory(currMemory, categoryText)
        return newMemory;
      })
    }

  } else { // add sub category
    const parentCatIndex = getParentCategoryIndex(memory.categories, parentCategory.name);
    debugger;
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
