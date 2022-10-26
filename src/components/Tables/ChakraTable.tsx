import React from 'react';
import SimpleTable from './SimpleTableV8';



export const ChakraTable = () => {
  return (
    <SimpleTable
      Thead={({ children, ...rest }) => (
        <Thead {...rest}>
          {children}
        </Thead>
      )}
    />
  )
}

export default ChakraTable