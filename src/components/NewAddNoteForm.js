import React, { useState } from 'react';
import formStyles from "../CSS/NewAddNoteForm.module.css";

const NewAddNoteForm = ({memory, setMemory, setShowAddNoteForm}) => {
  const [noteText, setNoteText] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);


  const handleCategoryClick = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };


  const handleNoteSubmit = (event) => {
    event.preventDefault();
    // extract this to a memory function - writeToMemory
    if (selectedCategories.length === 0) {
      alert("enter a category");
      return;
    }
  setMemory(currMemory => {
    const newMemory = {...currMemory};
    newMemory.notes.push({
      "note" : noteText,
      "tags" : selectedCategories,
      "additional_info" : "",
      "date_added" : ""
    });
    return newMemory;
  })
    
    setNoteText('');
      setShowAddNoteForm(false);
    setSelectedCategories([]);
  };

  return (
    <div className={formStyles["note-form-container"]}>
      <form onSubmit={handleNoteSubmit}>
        <textarea
          className={formStyles["note-text-input"]}
          placeholder="Enter note text here"
          value={noteText}
          onChange={(event) => setNoteText(event.target.value)}
        />

       
        <div className={formStyles["categories-container"]}>
        {memory.categories.map(category => (
          <div key={category} 
          className={`${formStyles["category-tab"]} ${selectedCategories.includes(category) ? formStyles["selected"] : ''}`}
          onClick={() => handleCategoryClick(category)}
          >
             
              {category}
          </div>
        )
          
        )}
        </div>
        <button type="submit" className={formStyles["submit-button"]}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewAddNoteForm;
