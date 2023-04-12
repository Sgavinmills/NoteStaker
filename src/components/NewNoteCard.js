import React, { useState, useEffect, useRef } from "react";
import styles from "../CSS/Card.module.css";
import formStyles from "../CSS/NewAddNoteForm.module.css";
import AddRemoveCategories from "./AddRemoveCategories";
import ConfirmModal from "./ConfirmModal";
import NoteIcons from "./NoteIcons";

const NoteCard = ({ note, setMemory, memory }) => {
  const textareaRef = useRef(null); // Create a ref to the textarea element

  const [noteText, setNoteText] = useState(note.note);
  const [textAreaHeight, setTextAreaHeight] = useState(38);
  const [inFocus, setInFocus] = useState(false);
  const [displayCategories, setDisplayCategories] = useState(false);
  const [touchTimeout, setTouchTimeout] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const confirmationMessage =
    "Are you sure? Note will be deleted from all categories";

  // need this one otherwise the textareas don't update when memory state changes (ie deleting an item) because
  // it doesnt directly display anything from the memory state.
  useEffect(() => {
    setNoteText(note.note);
  }, [memory, note.note]);

  useEffect(() => {
    if (textareaRef?.current) {
      setTextAreaHeight(textareaRef.current.scrollHeight);
    }
  }, [memory]);

  // focuses on the first note if it has just been put there by 'add note' and needs filling in
  useEffect(() => {
    if (note.newEmptyNote) {
      textareaRef.current.focus();
    }
  }, [note.newEmptyNote]);

  const handleDeleteConfirmClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsModalOpen(false);
    removeFromMemory();
  };

  const removeFromMemory = () => {
    setMemory((currMemory) => {
      const newMemory = { ...currMemory };
      const updatedNotes = [...newMemory.notes];
      const index = updatedNotes.reduce((acc, item, index) => {
        console.log(index, note.id, item.id);
        const isMatch = note.id === item.id;
        return isMatch ? index : acc;
      }, -1);

      updatedNotes.splice(index, 1);
      newMemory.notes = updatedNotes;
      return newMemory;
    });
  };

  // Really dont need to leave this but quite like how its handled so keeping for now
  // const optionNotHandled = () => {
  //   console.log("This option is not handled yet");
  // }
  // const options = [
  //   {
  //     option: "Delete item",
  //     // action: handleDeleteClick,
  //   },
  //   {
  //     option: "Add/remove categories",
  //     action: optionNotHandled
  //   },
  //   {
  //     option: "View additional details",
  //     action: optionNotHandled
  //   }
  // ]

  const handleChange = (event) => {
    setNoteText(event.target.value);
    setTextAreaHeight(textareaRef.current.scrollHeight);
  };

  const handleFocus = (event) => {
    setInFocus(true);
  };

  const handleBlur = (event) => {
    setInFocus(false);
    handleSubmit(event);
  };

  const handleSubmit = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (noteText.length === 0) {
      if (note.newEmptyNote) {
        removeFromMemory();
        return;
      }
      setNoteText(note.note);
      return;
    }

    setMemory((currMemory) => {
      const newMemory = { ...currMemory };
      const updatedNotes = [...newMemory.notes];
      const index = updatedNotes.reduce((acc, item, index) => {
        const isMatch = note.id === item.id;
        return isMatch ? index : acc;
      }, -1);
      updatedNotes[index].note = noteText;
      updatedNotes[index].newEmptyNote = false; // or delete property?
      newMemory.notes = updatedNotes;
      return newMemory;
    });
  };

  const handleCategoryClick = (event, category) => {
    event.preventDefault();
    event.stopPropagation();

    setMemory((currMemory) => {
      const newMemory = { ...currMemory };
      const updatedNotes = [...newMemory.notes];
      const index = updatedNotes.reduce((acc, item, index) => {
        const isMatch = note.id === item.id;
        return isMatch ? index : acc;
      }, -1);

      const currCategories = updatedNotes[index].tags;
      const newCategories = [...currCategories];

      const catIndex = newCategories.indexOf(category);
      if (catIndex > -1) {
        newCategories.splice(catIndex, 1);
      } else {
        newCategories.push(category);
      }

      updatedNotes[index].tags = newCategories;

      newMemory.notes = updatedNotes;
      return newMemory;
    });
  };

  // saving for later, probably wants revamped. Maybe actually store a 'previousedit' variable? or multiple?
  const handleCancelClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    // add implementation here.
    // will need to add a 'noteHistory' property to the note
    // click can then read and update memory accordingly
    // obvs will need to go through and ensure noteHistory is updated whenever the note is updated
  };

  const handleAddRemoveCategoryClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDisplayCategories(!displayCategories);
  };
  
  const handleHighPriorityClick = (event) => {
    console.log("i am " + note.note)
    event.preventDefault();
    // event.stopPropagation();

    setMemory((currMemory) => {
      const newMemory = { ...currMemory };
      const updatedNotes = [...newMemory.notes];
      const index = updatedNotes.reduce((acc, item, index) => {
        const isMatch = note.id === item.id;
        return isMatch ? index : acc;
      }, -1);

      updatedNotes[index].isHighPriority = !updatedNotes[index].isHighPriority;
      newMemory.notes = updatedNotes;
      return newMemory;
    });
  };

  const handleMarkDoneClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setMemory((currMemory) => {
      const newMemory = { ...currMemory };
      const updatedNotes = [...newMemory.notes];
      const index = updatedNotes.reduce((acc, item, index) => {
        const isMatch = note.id === item.id;
        return isMatch ? index : acc;
      }, -1);

      updatedNotes[index].markDone = !updatedNotes[index].markDone;
      newMemory.notes = updatedNotes;
      return newMemory;
    });
  };

  const handleTouchStart = (event, touchType, categoryName) => {
    event.stopPropagation();
    event.preventDefault();
    if (!touchTimeout) {
      setTouchTimeout(true);
      setTimeout(() => {
        setTouchTimeout(false);
        console.log("inside the timeout...")
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
            setIsModalOpen(true);
            break;
          case "category":
            handleCategoryClick(event, categoryName);
            break;
          default:
            break;
        }
      }, 100);
    }
  };

  return (
    <>
      {isModalOpen && (
        <ConfirmModal
          handleDelete={handleDeleteConfirmClick}
          setIsModalOpen={setIsModalOpen}
          confirmationMessage={confirmationMessage}
        />
      )}
      <div className={styles["note-contents-container"]}>
        <div className={`${formStyles["textarea-container"]}`}>
          <textarea
            ref={textareaRef}
            style={{ height: `${textAreaHeight}px` }}
            className={`${formStyles["note-text-area"]} ${
              note.isHighPriority
                ? formStyles["note-text-area_high_prority"]
                : ""
            }`}
            placeholder="Enter note text here"
            value={noteText}
            onFocus={(event) => {
              handleFocus(event);
            }}
            onBlur={(event) => {
              handleBlur(event);
            }}
            onChange={(event) => {
              handleChange(event);
            }}
          />{" "}
          {inFocus && (
            <NoteIcons
              displayCategories={displayCategories}
              note={note}
              handleTouchStart={handleTouchStart}
              handleAddRemoveCategoryClick={handleAddRemoveCategoryClick}
              handleHighPriorityClick={handleHighPriorityClick}
              handleCancelClick={handleCancelClick}
            />
            // <span className={`${formStyles["icon-container"]}`}>
            // <span
            //   className={`${formStyles["plus-icon"]} ${displayCategories ? formStyles["plus-icon_selected"] : ""}`}
            //   onMouseDown={(event) => {
            //     handleAddRemoveCategoryClick(event);
            //   }}
            //   onTouchStart={(event) => {
            //     handleTouchStart(event, "addRemoveCategory");
            //   }}
            // >
            //   &#x2295;
            // </span>
            // <span
            //   className={`${formStyles["high-priority-icon"]} ${
            //     note.isHighPriority
            //       ? formStyles["note-text-area_high_prority"]
            //       : ""
            //   }`}
            //   onMouseDown={(event) => {
            //     handleHighPriorityClick(event);
            //   }}
            //   onTouchStart={(event) => {
            //     handleTouchStart(event, "highPriority");
            //   }}
            // >
            //   &#x2606;
            // </span>
            // <span
          //     className={`${formStyles["rewind-icon"]}`}
          //     onMouseDown={(event) => {
          //       handleCancelClick(event);
          //     }}
          //     onTouchStart={(event) => {
          //       handleTouchStart(event, "cancel");
          //     }}
          //   >
          //     &#x21BA;
          //   </span>
          //   <span
          //     className={`${formStyles["cross-icon"]}`}
          //     onMouseDown={(event) => {
          //       handleTouchStart(event, "delete");
          //     }}
          //     onTouchStart={(event) => {
          //       handleTouchStart(event, "delete");
          //     }}
          //   >
          //     &#x274C;
          //   </span>
          // </span>
          )}
        </div>
        <div className={styles["dots-and-tick-container"]}>
          {note.markDone ? (
            <span
              className={`${styles["done-tick"]}`}
              onMouseDown={(event) => {
                handleMarkDoneClick(event);
              }}
              onTouchStart={(event) => {
                handleTouchStart(event, "markDone");
              }}
            >
              &#x2705;
            </span>
          ) : (
            <span
              className={`${styles["not-done-tick"]}`}
              onMouseDown={(event) => {
                handleMarkDoneClick(event);
              }}
              onTouchStart={(event) => {
                handleTouchStart(event, "markDone");
              }}
            >
              &#x26AA;
            </span>
          )}
          <span
            className={styles["note-three-vertical-dots-icon"]}
            onClick={(event) => {}}
          >
            &#x22EE;
            {/* {showMoreOptions && <MoreOptions options={options} />} */}
          </span>
        </div>
      </div>

      {displayCategories && inFocus && (
        <AddRemoveCategories
          memory={memory}
          note={note}
          handleCategoryClick={handleCategoryClick}
          handleTouchStart={handleTouchStart}
        />
      )}
    </>
  );
};

export default NoteCard;
