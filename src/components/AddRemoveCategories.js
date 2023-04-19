import formStyles from "../CSS/NewAddNoteForm.module.css";
import React, { useState } from "react";

const AddRemoveCategories = ({
  memory,
  note,
  handleTouchStart,
  subCategoryName,
  parentCategory
}) => {
  const [displayingSubCategories, setDisplayingSubCategories] = useState(
    subCategoryName ? true : false
  );
  return (
    <div>
      {!displayingSubCategories ? (
        <div className={formStyles["categories-container"]}>
          {memory.categories.map((category) => (
            <div
              key={category.name}
              className={`${formStyles["category-tab"]} ${
                note.tags.some((tag) => tag.name === category.name)
                  ? formStyles["selected"]
                  : ""
              }`}
              onMouseDown={(event) =>
                handleTouchStart(event, "category", category.name, "parent")
              }
            >
              {category.name}
            </div>
          ))}
        </div>
      ) : (
        <div className={formStyles["categories-container"]}>
          {memory.categories.find(cat => cat.name === parentCategory.name).sub_categories.map((subCategory) =>  (
            <div
              key={subCategory}
              className={`${formStyles["category-tab"]} ${
                note.tags.some(tag => tag.sub_tags.includes(subCategory))
                               ? formStyles["selected"]
                  : ""
              }`}
              onMouseDown={(event) =>
                handleTouchStart(event, "category", subCategory, "sub", parentCategory)
              }
            >
              {subCategory}
            </div>
          ))}
        </div>
      )}
      
    </div>
  );
  
};

export default AddRemoveCategories;
