import React, { useState } from 'react';
import formStyles from "../CSS/AddNoteForm.module.css";

//CAN PROBABLY ONLY HAVE ONE SETSHOWEDDITTINGFORM/SHWADDNOTFORMFUNCTION IF THE PROPS HAE SAME NAME BUT DIFFERENT METHODS DEPENDING ON WHEER PASSED FROM
const NoteForm = ({memory, setMemory, setShowAddNoteForm, setShowEdittingForm, note}) => {
  const [noteText, setNoteText] = useState(note?.note ? note.note : '');
  const [additionalNoteText, setAdditionalNoteText] = useState(note?.additional_info ? note.additional_info : '');
  const [selectedCategories, setSelectedCategories] = useState(note?.tags ? note.tags : []);


  // if we manage to reuse this for editti then rename it to just NoteForm or SubmitNote or something
console.log("should be triggered....");
console.log(note);
  const handleCategoryClick = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // const [notes, setNotes] = useState([]);

  const handleNoteSubmit = (event) => {
    event.preventDefault();
console.log("handle submit...");
// extract this to a memory function - writeToMemory
if (setShowAddNoteForm) {
  setMemory(currMemory => {
    const newMemory = {...currMemory};
    newMemory.notes.push({
      "note" : noteText,
      "tags" : selectedCategories,
      "additional_info" : additionalNoteText,
      "date_added" : ""
    });
    // writeToLocalStorage(newMemory); // just here for testing. we actually want to ake t a useeffect at a higher level so always write when memory is updated??
    return newMemory;
  })
} else { // just need to edit existing note instead
  setMemory(currMemory => {
    const newMemory = {...currMemory};
    const updatedNotes = [...newMemory.notes];
    console.log(updatedNotes);
    const index = updatedNotes.reduce((acc, item, index) => {
      const isMatch = Object.keys(note).every(key => {
        if (Array.isArray(note[key])) {
          return note[key].every(tag => item[key].includes(tag));
        }
        return item[key] === note[key];
      });
      return isMatch ? index : acc;
    }, -1);
    console.log("INDEX" + index)
    console.log("why multiple?");
    updatedNotes[index].note = noteText;
    console.log("and me?")
    updatedNotes[index].tags = selectedCategories;
    updatedNotes[index].additional_info = additionalNoteText;
    newMemory.notes = updatedNotes;
    console.log(updatedNotes);
    return newMemory;
  })

}
    
    setNoteText('');
    setAdditionalNoteText('');
    if (setShowAddNoteForm) {

      setShowAddNoteForm(false);
    } else {
      setShowEdittingForm(false);
    }
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

        <textarea 
          className={formStyles["note-text-input"]}
          placeholder="Enter additional details here"
          value={additionalNoteText}
          onChange={(event) => setAdditionalNoteText(event.target.value)}
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

export default NoteForm;
