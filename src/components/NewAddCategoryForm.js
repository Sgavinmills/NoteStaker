import React, { useState } from 'react';
import formStyles from "../CSS/NewAddNoteForm.module.css";

const NewAddNoteForm = ({setMemory, setAddCategory, memory}) => {
  const [categoryText, setCategoryText] = useState('');

  const handleCategorySubmit = (event) => {
    event.preventDefault();
    if (!memory.categories.includes(categoryText) && categoryText.length > 2) {
      setMemory(currMemory => {
        const newMemory = {...currMemory};
        const newCategories = [...newMemory.categories];
        newCategories.push(categoryText);
        newMemory.categories = newCategories;
        return newMemory;
      })
    }
    setAddCategory(false);    
    setCategoryText('');
  };

  const handleCancel = (event) => {
    setAddCategory(false);
  }

  return (
    <div className={`${formStyles["note-form-container"]}`}>
      <form onSubmit={handleCategorySubmit}>
        <textarea
          className={`${formStyles["note-text-input"]} `}
          placeholder="Enter note text here"
          value={categoryText}
          onChange={(event) => setCategoryText(event.target.value)}
        />

    
        <button type="submit" className={formStyles["submit-button"]}>
          Submit
        </button>
        <button type="cancel" className={formStyles["submit-button"]} onClick={(event) => {handleCancel(event)}}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default NewAddNoteForm;
