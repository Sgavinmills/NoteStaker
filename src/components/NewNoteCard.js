import React, { useState , useEffect, useRef} from "react";
import styles from "../CSS/Card.module.css";
import formStyles from "../CSS/NewAddNoteForm.module.css";
// import NewAddNoteForm from "./NewAddNoteForm";
import MoreOptions from "./MoreOptions";

const NoteCard = ({ note, setMemory, memory, noteContent }) => {
  const textareaRef = useRef(null); // Create a ref to the textarea element
  
  // const [edittingNote, setEdittingNote] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [highPriority, setHighPriority] = useState(note.isHighPriority);
  const [noteText, setNoteText] = useState(note.note);
  const [textAreaHeight, setTextAreaHeight] = useState(38);
  const [inFocus, setInFocus] = useState(false);
  const [originalNote, setOriginalNote] = useState(noteContent);
  const [displayCategories, setDisplayCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(note.tags);



  // need this one otherwise the textareas don't update when memory state changes (ie deleting an item) because
  // it doesnt directly display anything from the memory state. 
  useEffect(() => {
    // if (note.note !== noteText) {
      setNoteText(note.note); 
    // }
  }, [note.note]); 

  useEffect(() => {
    if (textareaRef?.current) {
      setTextAreaHeight(textareaRef.current.scrollHeight);

    }
  }, [memory])

  useEffect(() => {
    setMemory(currMemory => {
      const newMemory = {...currMemory}
      const updatedNotes = [...newMemory.notes];
      const index = updatedNotes.reduce((acc, item, index) => {
        const isMatch = note.id === item.id;
        return isMatch ? index : acc;
      }, -1);

      updatedNotes[index].tags = [...selectedCategories];
      newMemory.notes = updatedNotes;
      return newMemory;
    })
  }, [selectedCategories, setMemory, note.id])

  const handleMoreOptionsClick = (event) => {
    event.stopPropagation();
    setShowMoreOptions(!showMoreOptions);
  }

  const handleDelete = (event) => {
    event.preventDefault();

    setShowMoreOptions(false);
console.log("in here?")
    setMemory(currMemory => {
      const newMemory = {...currMemory};
      const updatedNotes = [...newMemory.notes];
      const index = updatedNotes.reduce((acc, item, index) => {
        console.log(index, note.id, item.id)
        const isMatch = note.id === item.id;
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
    console.log("also blurring....")
    setInFocus(false);
    handleSubmit(event);
    // setDisplayCategories(false);


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
      }, -1);

      updatedNotes[index].note = noteText;
      newMemory.notes = updatedNotes;
      return newMemory;
    })

  }  

  const handleCategoryClick = (event, category) => {
    console.log(event)
    event.preventDefault();
    event.stopPropagation();
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }

   
  };


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

  const handleAddRemoveCategoryIconClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDisplayCategories(!displayCategories);
  }

  const handleHighPriorityClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setMemory(currMemory => {
      const newMemory = {...currMemory}
      const updatedNotes = [...newMemory.notes];
      const index = updatedNotes.reduce((acc, item, index) => {
        const isMatch = note.id === item.id;
        return isMatch ? index : acc;
      }, -1);
      
      // updatedNotes[index].tags = [...selectedCategories];
      updatedNotes[index].isHighPriority = !highPriority;
      newMemory.notes = updatedNotes;
      return newMemory;
    })
    setHighPriority(!highPriority);
  }
  return (
    <>
     <div className={styles["note-contents-container"]}>
     {/* <p
        className={styles["note-paragraph"]}
        // onClick={(event) => handleEdit(event)}
      >
        {note.note}
      </p>  */}
      <div className={`${formStyles["textarea-container"]}`}>
        <textarea 
        ref={textareaRef}
        style={{ height: `${textAreaHeight}px`}}
        className={`${formStyles["note-text-input-test"]} ${highPriority ? formStyles["note-text-input-test_high_prority"] : ""}`}
        placeholder="Enter note text here"
        value={noteText}
        onFocus={(event) => { handleFocus(event) }}
        onBlur={(event) => { handleBlur(event) }}
        onChange={(event) => { handleChange(event)}}
        id={note.id}
        /> { inFocus && 
        <span className={`${formStyles["icon-container"]}`}>


          <span className={`${formStyles["plus-icon"]}`} onMouseDown={(event) => {handleAddRemoveCategoryIconClick(event)}} onTouchStart={(event) => {handleAddRemoveCategoryIconClick(event)}}>&#x2295;</span>
          <span className={`${formStyles["high-priority-icon"]} ${highPriority ? formStyles["note-text-input-test_high_prority"] : ""}`} onMouseDown={(event) => {handleHighPriorityClick(event)}} onTouchStart={(event) => {handleHighPriorityClick(event)}}>&#x2606;</span>
          <span className={`${formStyles["rewind-icon"]}`} onMouseDown={(event) => {handleCancel(event)}} onTouchStart={(event) => {handleCancel(event)}}>&#x21BA;</span>
          <span className={`${formStyles["tick-icon"]}`} onClick={(event) => {console.log("nothing for now, submit happens on blur anyway")}}>&#x2705;</span>
          <span className={`${formStyles["cross-icon"]}`} onMouseDown={(event) => {handleDelete(event)}} onTouchStart={(event) => {handleDelete(event)}} >&#x274C;</span>
        </span> }
      </div>
      <span className={styles["note-three-vertical-dots-icon"]} onClick={(event) => {handleMoreOptionsClick(event)}}>&#x22EE;
     {showMoreOptions && <MoreOptions options={options} />}
      </span>

     </div>

     {/* // DEFO MAKE THIS ITS OWN ADDREMOVECATEGORIES COMPONENT */}
     { displayCategories && inFocus && <div className={formStyles["categories-container"]}>
        {memory.categories.map(category => (
          <div key={category} 
          className={`${formStyles["category-tab"]} ${selectedCategories.includes(category) ? formStyles["selected"] : ''}`}
          onMouseDown={(event) => handleCategoryClick(event, category)}
          onTouchStart={(event) => handleCategoryClick(event, category)}
          >
             
              {category}
          </div>

        )
          
        )}
        </div>}
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
