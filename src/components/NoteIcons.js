import formStyles from "../CSS/NewAddNoteForm.module.css";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpDown } from '@fortawesome/free-solid-svg-icons'
const NoteIcons = ({note, handleTouchStart, displayCategories}) => {

  return (
    
        <span className={`${formStyles["icon-container"]}`}>
          <span
            className={`${formStyles["plus-icon"]} ${displayCategories ? formStyles["plus-icon_selected"] : ""}`}
            onMouseDown={(event) => {
              handleTouchStart(event, "addRemoveCategory");
            }}
            // onTouchStart={(event) => {
            //   handleTouchStart(event, "addRemoveCategory");
            // }}
          >
            &#x2295;
          </span>
          <span
            className={`${formStyles["high-priority-icon"]} ${
              note.priority === "high"
                ? formStyles["note-text-area_high_priority"]
                : note.priority === "low" ? formStyles["note-text-area_low_priority"]
                : ""
            }`}
            onMouseDown={(event) => {
              handleTouchStart(event, "highPriority");
            }}
            // onTouchStart={(event) => {
            //   handleTouchStart(event, "highPriority");
            // }}
          >
            &#x2606;
          </span>
          <span
            className={`${formStyles["rewind-icon"]}`}
            onMouseDown={(event) => {
              handleTouchStart(event, "moveNote");
            }}
            // onTouchStart={(event) => {
            //   handleTouchStart(event, "cancel");
            // }}
          >
            {/* &#x21BA; */}
          <FontAwesomeIcon icon={faUpDown} />
          </span>
          <span
            className={`${formStyles["cross-icon"]}`}
            onMouseDown={(event) => {
              handleTouchStart(event, "delete");
            }}
            // onTouchStart={(event) => {
            //   handleTouchStart(event, "delete");
            // }}
          >
            &#x274C;
          </span>
        </span>
      
  );
};

export default NoteIcons;
