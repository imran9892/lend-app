import React from 'react';
import classes from './button.module.css';

const Button = ({ children, onClick, style, type }) => {
  return (
    <button
      className={classes.button}
      onClick={onClick}
      style={style ? style : {}}
      type={type ? type : 'button'}
    >
      {children}
    </button>
  );
};

export default Button;
