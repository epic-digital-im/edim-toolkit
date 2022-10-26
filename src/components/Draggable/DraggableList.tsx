import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useColorMode } from '@chakra-ui/react';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const DraggableList = ({ items, onColumnOrderChange, renderItem }) => {
  const { colorMode } = useColorMode();
  const [itemState, setItemState] = React.useState(items);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      itemState,
      result.source.index,
      result.destination.index
    );

    setItemState(items);
    if (onColumnOrderChange) {
      onColumnOrderChange(items);
    }
  }

  const bg1 = (colorMode === 'light') ? 'white' : "#1a202c";
  const bg2 = (colorMode === 'light') ? '#d3d3d3' : "#1f2733";
  const bg3 = (colorMode === 'light') ? 'white' : "#292c32";
  const bg4 = (colorMode === 'light') ? 'white' : "#292c32";

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? bg2 : bg1,

    // styles we need to apply on draggables
    ...draggableStyle
  });

  const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? bg3 : bg4,
    padding: grid,
    width: 250
  });

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{ ...getListStyle(snapshot.isDraggingOver), width: '95%', margin: '0 auto' }}
          >
            {itemState && itemState.length > 0 && itemState.map((item, index) => (
              <Draggable key={item.name} draggableId={item.name} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    {renderItem(item)}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default DraggableList;
