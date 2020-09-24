import React from 'react';

export const escapedNewLineToLineBreakTag = (string) => {
  return string.split('\\n').map((item, index) => {
    return (
      <React.Fragment key={index}>
        {moreNewLineToLineBreakTag(item)}
        <br />
      </React.Fragment>
    )
  })
}

const moreNewLineToLineBreakTag = (string) => {
  return string.split('\n').map((item, index) => {
    return (
      <React.Fragment key={index}>
        {item}
        <br />
      </React.Fragment>
    )
  })
}