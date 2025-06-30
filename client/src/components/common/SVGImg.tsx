import React from 'react'

const SVGImg: React.FC<{ imgsrc: string }> = ({ imgsrc }) => (
  <img
    src={imgsrc}
    alt="icon"
    style={{
      width: "100%",
      height: "auto",
      userSelect: "none",
      pointerEvents: "none",
    }}
  />
);

export default SVGImg
