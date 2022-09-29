import React, { useRef, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { COLUMN_NAMES } from "./constants";
import { tasks } from "./tasks";

import "./assets/styles/App.css";
import { Motion } from "react-motion";
import Ticket from "./Ticket";

const MovableItem = ({
  name,
  index,
  ticket_id,
  profile,
  currentColumnName,
  moveCardHandler,
  setItems
}) => {
  const changeItemColumn = (currentItem, columnName) => {
    setItems((prevState) => {
      return prevState.map((e) => {
        return {
          ...e,
          column: e.name === currentItem.name ? columnName : e.column
        };
      });
    });
  };

  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: "Our first type",
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      // if (dragIndex === hoverIndex) {
      //   return;
      // }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 3;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCardHandler(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    item: { index, name, currentColumnName, type: "Our first type" },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();

      if (dropResult) {
        const { name } = dropResult;
        const { DO_IT, IN_PROGRESS, AWAITING_REVIEW, QA,  DONE } = COLUMN_NAMES;
        switch (name) {
          case IN_PROGRESS:
            changeItemColumn(item, IN_PROGRESS);
            break;
          case AWAITING_REVIEW:
            changeItemColumn(item, AWAITING_REVIEW);
            break;
          case QA:
            changeItemColumn(item, QA);
            break;
          case DONE:
            changeItemColumn(item, DONE);
            break;
          case DO_IT:
            changeItemColumn(item, DO_IT);
            break;
          default:
            break;
        }
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const opacity = isDragging ? 0 : 1;

  drag(drop(ref));

  return (
         <div 
            ref={ref} 
            className="movable-item" 
            style={{ opacity }} 
         >
            <Ticket ticket_id={ticket_id} name={name} profile={profile} />
        </div>
  );
};

const Column = ({ children, className, title }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: "Our first type",
    drop: () => ({ name: title }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    }),
    // Override monitor.canDrop() function
    canDrop: (item) => {
      const { QA } = COLUMN_NAMES;
      return (
        title === QA ? false : true
        // currentColumnName === title ||
        // (currentColumnName === DO_IT && title === IN_PROGRESS) ||
        // (currentColumnName === IN_PROGRESS &&
        //   (title === DO_IT || title === AWAITING_REVIEW)) ||
        // (currentColumnName === AWAITING_REVIEW &&
        //   (title === IN_PROGRESS || title === DONE)) ||
        // (currentColumnName === DONE && title === AWAITING_REVIEW)
      );
    }
  });

  const getBackgroundColor = () => {
    if (isOver) {
      if (canDrop) {
        // return "rgb(188,251,255)";
        return 'lightblue'
      } else if (!canDrop) {
        // return "rgb(255,188,188)";
        return '#F4F4F8'
      }
    } else {
      return "";
    }
  };

  const getBorder = () => {
    if(isOver){
      if(canDrop){
        return "2px dashed #22a5f1"
      } else if (!canDrop){
        return "1px dashed gray"
      }
    } else{
       return "";
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <p style={{ textAlign: 'center'}}>{title}</p>

    <div
      ref={drop}
      className={className}
      style={{ 
        backgroundColor: getBackgroundColor(),
        border: getBorder(),
      }}
    >
      {children}
    </div>
    </div>
  );
};

export const App = () => {
  const [items, setItems] = useState(tasks);

  const moveCardHandler = (dragIndex, hoverIndex) => {
    const dragItem = items[dragIndex];

    if (dragItem) {
      setItems((prevState) => {
        const coppiedStateArray = [...prevState];

        // remove item by "hoverIndex" and put "dragItem" instead
        const prevItem = coppiedStateArray.splice(hoverIndex, 1, dragItem);

        // remove item by "dragIndex" and put "prevItem" instead
        coppiedStateArray.splice(dragIndex, 1, prevItem[0]);

        return coppiedStateArray;
      });
    }
  };

  const returnItemsForColumn = (columnName) => {
    return items
      .filter((item) => item.column === columnName)
      .map((item, index) => (
        <MovableItem
          key={item.id}
          name={item.name}
          currentColumnName={item.column}
          setItems={setItems}
          index={index}
          ticket_id={item.ticket_id}
          profile={item.profile}
          moveCardHandler={moveCardHandler}
        />
      ));
  };

  const { DO_IT, IN_PROGRESS, AWAITING_REVIEW, QA, DONE } = COLUMN_NAMES;

  return (
    <div className="container">
      <DndProvider backend={HTML5Backend}>
        <Column title={DO_IT} className="column do-it-column">
          {returnItemsForColumn(DO_IT)}
        </Column>
        <Column title={IN_PROGRESS} className="column in-progress-column">
          {returnItemsForColumn(IN_PROGRESS)}
        </Column>
        <Column
          title={AWAITING_REVIEW}
          className="column awaiting-review-column"
        >
          {returnItemsForColumn(AWAITING_REVIEW)}
        </Column>
        <Column title={QA} className="column qa-column">
          {returnItemsForColumn(QA)}
        </Column>
        <Column title={DONE} className="column done-column">
          {returnItemsForColumn(DONE)}
        </Column>
        
      </DndProvider>
    </div>
  );
};
