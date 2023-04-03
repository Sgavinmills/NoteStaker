import React, { useState } from 'react';
import formStyles from "../CSS/AddNoteForm.module.css";

const NoteForm = ({memory, setMemory, setShowAddNoteForm}) => {
  const [noteText, setNoteText] = useState('');
  const [additionalNoteText, setAdditionalNoteText] = useState('');
  // const [notes, setNotes] = useState([]);

  const handleNoteSubmit = (event) => {
    event.preventDefault();
    // setNotes([...notes, noteText]);
    setMemory((currMemory) => {
      const newMemory = {...currMemory};
      newMemory[noteText] = {
        "tags" : [],
        "additional_notes" : additionalNoteText,
        "date_added" : ""
      }
      console.log(newMemory);
      return newMemory;
    })
    setNoteText('');
    setAdditionalNoteText('');
    setShowAddNoteForm(false);
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
        <button type="submit" className={formStyles["submit-button"]}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default NoteForm;
