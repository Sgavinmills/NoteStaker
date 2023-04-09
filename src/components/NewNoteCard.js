import React, { useState , useEffect, useRef} from "react";
import styles from "../CSS/Card.module.css";
import formStyles from "../CSS/NewAddNoteForm.module.css";
// import NewAddNoteForm from "./NewAddNoteForm";
import MoreOptions from "./MoreOptions";

const NoteCard = ({ note, setMemory, memory }) => {
  const textareaRef = useRef(null); // Create a ref to the textarea element
  
  // const [edittingNote, setEdittingNote] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [noteText, setNoteText] = useState(note.note);
  const [textAreaHeight, setTextAreaHeight] = useState(38);
  const [inFocus, setInFocus] = useState(false);
  const [originalNote, setOriginalNote] = useState(note.note);

  useEffect(() => {
    if (textareaRef?.current) {
      setTextAreaHeight(textareaRef.current.scrollHeight);

    }
  }, [memory])


  // const handleEdit = (event) => {
  //   console.log("never get ehre do i?")
  //   event.stopPropagation();
  //   setEdittingNote(!edittingNote);
  // };

  const handleMoreOptionsClick = (event) => {
    event.stopPropagation();
    setShowMoreOptions(!showMoreOptions);
  }

  const handleDelete = () => {
    setShowMoreOptions(false);

    setMemory(currMemory => {
      const newMemory = {...currMemory};
      const updatedNotes = [...newMemory.notes];
      // THIS SHOULD BE EXTRACTED INTO A MEMORY FUNCTION
      const index = updatedNotes.reduce((acc, item, index) => {
        const isMatch = Object.keys(note).every(key => {
          if (Array.isArray(note[key])) {
            return note[key].every(tag => item[key].includes(tag));
          }
          return item[key] === note[key];
        });
        return isMatch ? index : acc;
      }, -1);

      updatedNotes.splice(index, 1);
      newMemory.notes = updatedNotes;
      return newMemory;
    })
  }

  const optionNotHandled = () => {
    console.log("This option is not handled yet");
  }
  const options = [
    { 
      option: "Delete item",
      action: handleDelete,
    },
    {
      option: "Add/remove categories",
      action: optionNotHandled
    },
    {
      option: "View additional details",
      action: optionNotHandled
    }
  ]

  const handleChange = (event) => {
    console.log(textareaRef.current.scrollHeight)
    console.log(textareaRef.current.clientHeight)
    console.log(textareaRef)
    setNoteText(event.target.value)
    setTextAreaHeight(textareaRef.current.scrollHeight);

  }

  const handleFocus = (event) => {
    setInFocus(true);
  }

  const handleBlur = (event) => {
    // setTimeout(() => {
    //   setInFocus(false);
    // }, 100);
    handleSubmit(event);

  }
  const handleSubmit = (event) => {
    // event.stopPropagation();
    if (noteText.length === 0) {
      alert("cant leave note blank, delete instead if you want")
      return;
    }
    setMemory(currMemory => {
      const newMemory = {...currMemory};
      const updatedNotes = [...newMemory.notes];
      // once we give each item unique id can simply this nonsense
      // const index = updatedNotes.reduce((acc, item, index) => {
      //   const isMatch = Object.keys(note).every(key => {
      //     if (Array.isArray(note[key])) {
      //       return note[key].every(tag => item[key].includes(tag));
      //     }
      //     return item[key] === note[key];
      //   });
      //   return isMatch ? index : acc;
      // }, -1);

      const index = updatedNotes.reduce((acc, item, index) => {
        const isMatch = note.id === item.id;
        return isMatch ? index : acc;
      }, -1)
console.log(index)
      updatedNotes[index].note = noteText;
      newMemory.notes = updatedNotes;
      return newMemory;
    })

  }  
  const handleCancel = (event) => {
    event.preventDefault();
    // setCancelClicked(true);
    // console.log(cancelClicked)
    event.stopPropagation();
    if (noteText !== originalNote) {
      setNoteText(originalNote)
      setOriginalNote(originalNote) // defo dont need this, just to pass warnings on build. 
      // setmemory where note is original note 
      // setMemory(currMemory => {
      //   const newMemory = {...currMemory};
      //   const updatedNotes = [...newMemory.notes];
       
      //   const index = updatedNotes.reduce((acc, item, index) => {
      //     const isMatch = note.id === item.id;
      //     return isMatch ? index : acc;
      //   }, -1)
      //   updatedNotes[index].note = originalNote;
      //   newMemory.notes = updatedNotes;
      //   return newMemory;
      // })
    // setNoteText(originalNote);

    }

    // if (noteText !== originalNote) {
      
    // }
    // setNoteText(note.note);
  }
  return (
    <>
     <div className={styles["note-contents-container"]}>
     {/* <p
        className={styles["note-paragraph"]}
        onClick={(event) => handleEdit(event)}
      >
        {note.note}
      </p>  */}
      <div className={`${formStyles["textarea-container"]}`}>
        <textarea 
        ref={textareaRef}
        style={{ height: `${textAreaHeight}px`}}
        className={`${formStyles["note-text-input-test"]} `}
        placeholder="Enter note text here"
        value={noteText}
        onFocus={(event) => { handleFocus(event) }}
        onBlur={(event) => { handleBlur(event) }}
        onChange={(event) => { handleChange(event)}}
      
        /> { inFocus && 
        <span className={`${formStyles["icon-container"]}`}>
          <span className={`${formStyles["tick-icon"]}`} onClick={(event) => {console.log("nothing for now, submit happens on blur anyway")}}>&#x2705;</span>
          <span className={`${formStyles["cross-icon"]}`} onMouseDown={(event) => {handleCancel(event)}}>&#x274C;</span>
        </span> }
      </div>
      <span className={styles["note-three-vertical-dots-icon"]} onClick={(event) => {handleMoreOptionsClick(event)}}>&#x22EE;
     {showMoreOptions && <MoreOptions options={options} />}
      </span>

     </div>
      {/* {edittingNote && (
        <NewAddNoteForm
          memory={memory}
          setMemory={setMemory}
          setEdittingForm={setEdittingNote}
          noteToEdit={note}
        />
      )} */}
    </>
  );
};

export default NoteCard;
