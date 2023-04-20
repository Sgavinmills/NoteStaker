import formStyles from "../CSS/NewAddNoteForm.module.css";
import React, { useEffect } from "react";

const AddRemoveCategories = ({
  memory,
  note,
  handleTouchStart,
  subCategoryName,
  parentCategory,
  setDisplayingSubCategories,
  displayingSubCategories,
  subCatToDisplay,
  setSubCatToDisplay,
}) => {
  
useEffect(() => {
  setSubCatToDisplay(parentCategory.name)
}, [setSubCatToDisplay, parentCategory.name])

  const handleSwapCategoryClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    if (!displayingSubCategories) {
      setSubCatToDisplay(parentCategory.name)
    }
    setDisplayingSubCategories(!displayingSubCategories)
}
  return (
    <div>
      {!displayingSubCategories ? (
        <div className={formStyles["categories-container"]}>
          {memory.categories.map((category) => (
            <div
              key={category.name}
              className={`${formStyles["category-tab"]} ${formStyles["category-tab-sub"]} ${
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
          {parentCategory.sub_categories.length > 0 && <div
              className={`${formStyles["category-tab"]} ${formStyles["category-tab"]} ${formStyles["category-tab-parent"]}`}
              onMouseDown={(event) =>
                handleSwapCategoryClick(event)
              }
            >
              <span className={`${formStyles["category-swap-arrow"]}`}>⇓</span>
            </div>}
        </div>
      ) : (
        <div className={formStyles["categories-container"]}>
          {memory.categories.find(cat => cat.name === subCatToDisplay)?.sub_categories.map((subCategory) =>  (
            <div
              key={subCategory}
              className={`${formStyles["category-tab"]} ${formStyles["category-tab-parent"]} ${
                note.tags.some(tag => tag.sub_tags.includes(subCategory))
                               ? formStyles["selected"]
                  : ""
              }`}
              onMouseDown={(event) =>
                handleTouchStart(event, "category", subCategory, "sub", subCatToDisplay)
              }
            >
              {subCategory}
            </div>
          ))}
            <div
              className={`${formStyles["category-tab"]} ${formStyles["category-tab"]} ${formStyles["category-tab-sub"]}`}
              onMouseDown={(event) =>
                handleSwapCategoryClick(event)
              }
            >
             <span className={`${formStyles["category-swap-arrow"]}`}>  ⇑  </span>
            </div>
        </div>
      )}
      
    </div>
  );
  
};

export default AddRemoveCategories;
