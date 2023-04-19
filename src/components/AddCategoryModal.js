import React, { useState } from 'react';
import ModalStyles from "../CSS/Modal.module.css";

const AddCategoryModal = ({setAddingCategory, setMemory, memory, parentCategory}) => {
const [categoryText, setCategoryText] = useState('');

const handleSubmit = (event) => {
  event.stopPropagation();
  event.preventDefault();
  setAddingCategory(false);
  if (!parentCategory) { // add normal category
    if (!memory.categories.some(cat => cat === categoryText) && categoryText.length > 2) {
      setMemory(currMemory => {
        const newMemory = {...currMemory};
        const newCategories = [...newMemory.categories];
        newCategories.push({ "name" : categoryText, "sub_categories" : []});
        newMemory.categories = newCategories;
        return newMemory;
      })
    }

  } else { // add sub category
  
    const parentCatIndex = memory.categories.reduce((acc, category, index) => {
      const isMatch = category.name === parentCategory.name;
      return isMatch ? index : acc;
    }, -1)

    if (!memory.categories[parentCatIndex].sub_categories.includes(categoryText) && categoryText.length > 2) {
      setMemory(currMemory => {
        const newMemory = {...currMemory};
        const newCategories = [...newMemory.categories];
        newCategories[parentCatIndex].sub_categories.push(categoryText);
        newMemory.categories = newCategories;
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
