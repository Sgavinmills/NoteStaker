import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import update from 'immutability-helper';

const Box = ({ text, index, moveBox }) => {
  const ref = React.useRef(null);

  const [{ isDragging }, drag] = useDrag({
    item: { index, type: 'BOX' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'BOX',
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveBox(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div ref={ref} className="box" style={{ opacity: isDragging ? 0.5 : 1 }}>
      {text}
    </div>
  );
};

const BoxList = ({ items }) => {
  const [boxes, setBoxes] = React.useState(items);

  const moveBox = (dragIndex, hoverIndex) => {
    const draggedBox = boxes[dragIndex];
    setBoxes(
      update(boxes, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, draggedBox],
        ],
      })
    );
  };

  return (
    <div>
      {boxes.map(({ index, text }, i) => (
        <Box
          key={index}
          index={i}
          text={text}
          moveBox={moveBox}
        />
      ))}
    </div>
  );
};

export default BoxList;
