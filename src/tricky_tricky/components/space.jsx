import React from 'react'

const Space = (props) => {

  let newId = 'none';

  if (props.selectTop.row === props.row && props.selectTop.col === props.col) {
    newId = 'topSelect';
  }
  if (props.selectTop.row + 1 === props.row && props.selectTop.col === props.col) {
    newId = 'bottomSelect';
  }

  return (
    <>
      <img id={newId} className="blocks" src={props.img}></img>
    </>
  )
}

export default Space;
