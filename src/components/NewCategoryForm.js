import React, { useState } from 'react';
import formStyles from "../CSS/AddNoteForm.module.css";

const AddCategoryForm = ({setMemory, setShowAddCategoryForm}) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
  setMemory(currMemory => {
    const newMemory = {...currMemory};
    const newCategories = [...newMemory.categories];
    newCategories.push(inputText);
    newMemory.categories = newCategories;
    return newMemory;
  })
  setInputText('');

  setShowAddCategoryForm(false);

}
  

  return (
    <div className={formStyles["note-form-container"]}>
      <form onSubmit={handleSubmit}>
        <textarea
          className={formStyles["note-text-input"]}
          placeholder="Enter category here..."
          value={inputText}
          onChange={(event) => setInputText(event.target.value)}
        />

        <button type="submit" className={formStyles["submit-button"]}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddCategoryForm;
