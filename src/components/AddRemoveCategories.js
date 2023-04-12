import formStyles from "../CSS/NewAddNoteForm.module.css";
import React from 'react';

const AddRemoveCategories = ({memory, note, handleCategoryClick, handleTouchStart}) => {

  return (
    <div className={formStyles["categories-container"]}>
          {memory.categories.map((category) => (
            <div
              key={category}
              className={`${formStyles["category-tab"]} ${
                note.tags.includes(category) ? formStyles["selected"] : ""
              }`}
              onMouseDown={(event) => handleCategoryClick(event, category)}
              onTouchStart={(event) =>
                handleTouchStart(event, "category", category)
              }
            >
              {category}
            </div>
          ))}
        </div>
       
            
  );
};

export default AddRemoveCategories;
