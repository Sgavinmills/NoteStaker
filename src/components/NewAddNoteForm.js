import React, { useState } from 'react';
import formStyles from "../CSS/NewAddNoteForm.module.css";

const NewAddNoteForm = ({memory, setMemory, setShowAddNoteForm, directToCategory, noteToEdit, setEdittingForm}) => {
  const [noteText, setNoteText] = useState(noteToEdit ? noteToEdit.note : '');
  const [selectedCategories, setSelectedCategories] = useState(noteToEdit ? noteToEdit.tags : []);


  const handleCategoryClick = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };


  const handleNoteSubmit = (event) => {
    event.preventDefault();
    if (noteText.length === 0) {
      return;
    }
    // extract this to a memory function - writeToMemory
    if (selectedCategories.length === 0 && !directToCategory) {
      alert("enter a category");
      return;
    }

    if (noteToEdit) {
      // find note and replace with this one
      setMemory(currMemory => {
        const newMemory = {...currMemory};
        const updatedNotes = [...newMemory.notes];
        // once we give each item unique id can simply this nonsense
        const index = updatedNotes.reduce((acc, item, index) => {
          const isMatch = Object.keys(noteToEdit).every(key => {
            if (Array.isArray(noteToEdit[key])) {
              return noteToEdit[key].every(tag => item[key].includes(tag));
            }
            return item[key] === noteToEdit[key];
          });
          return isMatch ? index : acc;
        }, -1);
        updatedNotes[index].note = noteText;
        updatedNotes[index].tags = selectedCategories;
        newMemory.notes = updatedNotes;
        return newMemory;
      })

      setEdittingForm(false);


    } else {
      // add item to start of notes array
      setMemory(currMemory => {
        const newMemory = {...currMemory};
        newMemory.notes.unshift({
          "note" : noteText,
          "tags" : directToCategory ? [directToCategory] : selectedCategories,
          "additional_info" : "",
          "date_added" : ""
        });
        return newMemory;
      })
      setShowAddNoteForm(false);

    }
    
    setNoteText('');
    setSelectedCategories([]);
  };

  return (
    <div className={`${formStyles["note-form-container"]} ${!directToCategory && !noteToEdit ? formStyles["note-form-container_new_note"] : ""}`}>
      <form onSubmit={handleNoteSubmit}>
        <textarea
          className={`${formStyles["note-text-input"]} ${directToCategory || noteToEdit ? formStyles["note-text-input_reduced_height_textarea"] : ""}`}
          placeholder="Enter note text here"
          value={noteText}
          onChange={(event) => setNoteText(event.target.value)}
        />

        { !directToCategory && 
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
         }
        <button type="submit" className={formStyles["submit-button"]}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewAddNoteForm;
