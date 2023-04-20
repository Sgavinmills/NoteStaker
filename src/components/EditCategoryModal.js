import React, { useState } from 'react';
import ModalStyles from "../CSS/Modal.module.css";
import { editParentCategoryName, editSubCategoryName } from '../memoryFunctions/memoryFunctions';

const EditCategoryModal = ({setEdittingCategory, currCategoryName, setMemory, memory, subCategoryName, parentCategory}) => {
const [categoryText, setCategoryText] = useState(currCategoryName);

const handleSubmit = (event) => {
  event.stopPropagation();
  event.preventDefault();
  setEdittingCategory(false);

  // do need a check to make sure no othr categories called this. 
  if (subCategoryName) { // editting subcategory
    setMemory(currMemory => {
      const newMemory = editSubCategoryName(currMemory, subCategoryName, categoryText, parentCategory.name);
      return newMemory;
     })

  } else { // edititng parent category
    if (!memory.categories.some(category => category.name === categoryText) && categoryText.length > 2) {
      setMemory(currMemory => {
        const newMemory = editParentCategoryName(currMemory, currCategoryName, categoryText);
        return newMemory;
      })
    } else {
      alert("already a category with that name, sos");
    }

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
