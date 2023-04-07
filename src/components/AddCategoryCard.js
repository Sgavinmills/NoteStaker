import React from 'react';
import styles from "../CSS/Card.module.css";


const AddCategoryCard = ({showAddCategoryForm, setShowAddCategoryForm}) => {

  
  return (
    <div className={`${styles["card-container"]} ${styles["add-note-container"]}`} onClick={() => setShowAddCategoryForm(!showAddCategoryForm)}>
      <p className={styles["main-text"]}>Add Category(+)</p>
    </div>
  );
};

export default AddCategoryCard;
