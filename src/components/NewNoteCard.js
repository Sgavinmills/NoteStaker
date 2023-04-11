import React, { useState , useEffect, useRef} from "react";
import styles from "../CSS/Card.module.css";
import formStyles from "../CSS/NewAddNoteForm.module.css";
// import NewAddNoteForm from "./NewAddNoteForm";
import MoreOptions from "./MoreOptions";
import ConfirmModal from "./ConfirmModal";

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
  const [touchTimeout, setTouchTimeout] = useState(false);
  const [markDone, setMarkDone] = useState(note.markDone);
  const [isModalOpen, setIsModalOpen] = useState(false)
;


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

  useEffect(() => {
    setMemory(currMemory => {
      const newMemory = {...currMemory}
      const updatedNotes = [...newMemory.notes];
      const index = updatedNotes.reduce((acc, item, index) => {
        const isMatch = note.id === item.id;
        return isMatch ? index : acc;
      }, -1);

      updatedNotes[index].isHighPriority = highPriority;
      newMemory.notes = updatedNotes;
      return newMemory;
    })
  }, [highPriority, setMemory, note.id])

  useEffect(() => {
    setMemory(currMemory => {
      const newMemory = {...currMemory}
      const updatedNotes = [...newMemory.notes];
      const index = updatedNotes.reduce((acc, item, index) => {
        const isMatch = note.id === item.id;
        return isMatch ? index : acc;
      }, -1);

      updatedNotes[index].markDone = markDone;
      newMemory.notes = updatedNotes;
      return newMemory;
    })
  }, [markDone, setMemory, note.id])

  const handleMoreOptionsClick = (event) => {
    event.stopPropagation();
    setShowMoreOptions(!showMoreOptions);
  }

  const handleDeleteClick = (event) => {
    event.preventDefault();
    setIsModalOpen(false);
    // setShowMoreOptions(false);
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
      action: handleDeleteClick,
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


  const handleCancelClick = (event) => {
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

  const handleAddRemoveCategoryClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDisplayCategories(!displayCategories);
  }

  const handleHighPriorityClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    // this touchtimeout stuff seems to work, will need applying to other icons and category tabs. 
    // should prob usestate rather than global variables tho? 

        // setMemory(currMemory => {
        //   const newMemory = {...currMemory}
        //   const updatedNotes = [...newMemory.notes];
        //   const index = updatedNotes.reduce((acc, item, index) => {
        //     const isMatch = note.id === item.id;
        //     return isMatch ? index : acc;
        //   }, -1);
          
        //   // updatedNotes[index].tags = [...selectedCategories];
        //   updatedNotes[index].isHighPriority = !highPriority;
        //   newMemory.notes = updatedNotes;
        //   console.log("new memory:")
        //   console.log(newMemory);
        //   return newMemory;
        // })
        setHighPriority(!highPriority); // MIGHT WABT TO ADD THIS BACK .NOT SURE?
  }

  const handleMarkDoneClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setMarkDone(!markDone);
  }

  const handleTouchStart = (event, touchType, categoryName) => {
    // event.preventDefault();
    // event.stopPropagation();

    if (!touchTimeout) {
      setTouchTimeout(true);
      setTimeout(() => {
        setTouchTimeout(false);

        switch (touchType) {
          case "addRemoveCategory":
            handleAddRemoveCategoryClick(event);
            break;
          case "highPriority":
            handleHighPriorityClick(event);
            break;
          case "cancel":
            handleCancelClick(event);
            break;
          case "markDone":
            handleMarkDoneClick(event);
            break;
          case "delete":
            // handleDeleteClick(event);
            setIsModalOpen(true);
            break;
          case "category":
            handleCategoryClick(event, categoryName);
            break;
          default:
            break;
        }
      }, 200)
    }


  }
  return (
    <>
    {isModalOpen && <ConfirmModal handleDelete={handleDeleteClick} setIsModalOpen={setIsModalOpen} /> }
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


          <span className={`${formStyles["plus-icon"]}`} onMouseDown={(event) => {handleAddRemoveCategoryClick(event)}} onTouchStart={(event) => {handleTouchStart(event, "addRemoveCategory")}}>&#x2295;</span>
          <span className={`${formStyles["high-priority-icon"]} ${highPriority ? formStyles["note-text-input-test_high_prority"] : ""}`} onMouseDown={(event) => {handleHighPriorityClick(event)}} onTouchStart={(event) => {handleTouchStart(event, "highPriority")}}>&#x2606;</span>
          <span className={`${formStyles["rewind-icon"]}`} onMouseDown={(event) => {handleCancelClick(event)}} onTouchStart={(event) => {handleTouchStart(event, "cancel")}}>&#x21BA;</span>
          {/* <span className={`${formStyles["tick-icon"]}`} onMouseDown={(event) => {handleMarkDoneClick(event)}} onTouchStart={(event) => {handleTouchStart(event, "markDone")}}>&#x2705;</span> */}
          <span className={`${formStyles["cross-icon"]}`} onMouseDown={(event) => {handleTouchStart(event, "delete")}} onTouchStart={(event) => {handleTouchStart(event, "delete")}} >&#x274C;</span>
        </span> }
      </div>
      <div className={styles["dots-and-tick-container"]}>
      {/* <span className={`${styles["done-tick"]} ${markDone ? styles["done-tick-visible"] : styles["done-tick-invisible"]}`}>&#x2705;</span> */}
      { markDone ? <span className={`${styles["done-tick"]}`} onMouseDown={(event) => {handleMarkDoneClick(event)}} onTouchStart={(event) => {handleTouchStart(event, "markDone")}}>&#x2705;</span> 
        : <span className={`${styles["not-done-tick"]}`} onMouseDown={(event) => {handleMarkDoneClick(event)}} onTouchStart={(event) => {handleTouchStart(event, "markDone")}}>&#x26AA;</span> }
      <span className={styles["note-three-vertical-dots-icon"]} onClick={(event) => {handleMoreOptionsClick(event)}}>&#x22EE;
     {showMoreOptions && <MoreOptions options={options} />}
      </span>
      </div>
     </div>

     {/* // DEFO MAKE THIS ITS OWN ADDREMOVECATEGORIES COMPONENT */}
     { displayCategories && inFocus && <div className={formStyles["categories-container"]}>
        {memory.categories.map(category => (
          <div key={category} 
          className={`${formStyles["category-tab"]} ${selectedCategories.includes(category) ? formStyles["selected"] : ''}`}
          onMouseDown={(event) => handleCategoryClick(event, category)}
          onTouchStart={(event) => handleTouchStart(event, "category", category)}
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
