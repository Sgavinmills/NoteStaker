import React from 'react';
import OptionStyles from "../CSS/OptionsModal.module.css";

const MoreOptions = ({options}) => {

  return (
    <div className={`${OptionStyles["options-container"]} ${OptionStyles[""]}`}>
      { options?.map((option, index) => (

     <p key={index} className={OptionStyles["option-text"]} onClick={(option.action)}>{option.option}</p> 

      ))}


     
    </div>
  );
};

export default MoreOptions;
