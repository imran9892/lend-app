import React from 'react';
import classes from './card.module.css';

const Card = ({ children, onClick, style }) => {
  const className = `${classes.card} ${onClick ? classes.click : ''}`;
  return (
    <div className={className} onClick={onClick} style={style ? style : {}}>
      {children}
    </div>
  );
};

export default Card;
