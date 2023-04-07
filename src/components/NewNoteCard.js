import React, { useState } from 'react';
import styles from "../CSS/Card.module.css";
import NewNoteForm from './NewNoteForm';

const NoteCard = ({note, setShowNotes, setMemory, memory}) => {
  // const [showAdditionalDetails, setShowAdditionalDetails] = useState(false);
  const [showEdittingNote, setShowEdittingNote] = useState(false);

  // on render have a useeffect that checks if note.note length > 65 chars and aply the fadeout css if so
  // const [useFadeout,setUseFadeout] = useState(false)
  // useEffect(() => {
  //   console.log(note.note.length);
  //   console.log(showAdditionalDetails)
  //   // NEED BETTER WAY THAN LENGTH > 65 TO DETERMINE IF GONE ONTO NEXT LINE....
  //   if (note.note.length > 32 && !showAdditionalDetails) {
  //     console.log("setting usefadeout true...")
  //     setUseFadeout(true);
  //   } else {
  //     setUseFadeout(false);
  //   }
  // }, [showAdditionalDetails, note.note.length])


  const handleEdit = (event) => {
    console.log("editting....")
    event.stopPropagation();
    setShowEdittingNote(!showEdittingNote);
    // setShowAdditionalDetails(false);
  }

  // const handleDelete = (event) => {
  //   console.log("handling delete")
  //   event.stopPropagation();

  //   setMemory(currMemory => {
  //     const newMemory = {...currMemory};
  //     const updatedNotes = [...newMemory.notes];
  //     // THIS SHOULD BE EXTRACTED INTO A MEMORY FUNCTION
  //     const index = updatedNotes.reduce((acc, item, index) => {
  //       const isMatch = Object.keys(note).every(key => {
  //         if (Array.isArray(note[key])) {
  //           return note[key].every(tag => item[key].includes(tag));
  //         }
  //         return item[key] === note[key];
  //       });
  //       return isMatch ? index : acc;
  //     }, -1);

  //     updatedNotes.splice(index, 1);
  //     newMemory.notes = updatedNotes;
  //     console.log(newMemory);
  //     return newMemory;
  //   })
  // }
  return (
    <>
    <p className={styles["note-paragraph"]} onClick={(event) => handleEdit(event)} >{note.note}
       
    
    </p>
     {showEdittingNote && <NewNoteForm memory={memory} setMemory={setMemory} setShowEdittingForm={setShowEdittingNote} note={note}/>  }


    </>
    // <div className={`${styles["card-container"]} ${styles["note-card-container"]} 
    // ${showAdditionalDetails || showEdittingNote ? "" : styles["note-card-container_collapsed"]} ${!useFadeout ? "" : styles["note-card-container_fade_out"]}`
    
    // } 
    
    // onClick={()=> {setShowAdditionalDetails(!showAdditionalDetails); console.log("im anywhere on card")}}>
    //   <div className={styles["header-container"]}>
    //     <div className={styles["main-note-text-container"]}>


    //       <p className={styles["note-main-text"]}>{note.note}</p>
    //     </div>
    //     <div className={styles["icon-container"]}>
          
    //       <span className={styles["edit-icon"]} onClick={(event) => {handleEdit(event); }}>&#x270E;</span>
    //       <span className={styles["trash-icon"]} onClick={(event) => {handleDelete(event); }}>&#128465;</span>
    //       <span className={`${!showAdditionalDetails ? styles["note-down-arrow"] : styles["note-up-arrow"]}`} ></span>

    //     </div>

    //   </div>
    //   {showEdittingNote && <NewNoteForm memory={memory} setMemory={setMemory} setShowEdittingForm={setShowEdittingNote} note={note}/>  }

    //   { showAdditionalDetails &&
    //     <><p className={styles["additional-notes"]}>{note.additional_info}</p>

    //     <p className={styles["tags"]}> Categories: {note.tags.map((tag) => tag)} </p></>}
    // </div>
  );
};

export default NoteCard;
