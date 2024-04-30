import React, { useEffect } from 'react';

function Renderer(props) {
  useEffect(() => {
    const rendererElement = document.querySelector('.renderer');
    if (rendererElement) {
      rendererElement.style.backgroundColor = 'white'; 
    }
  }, []);

  return (
    <div className="renderer" style={{ height: '100%', width: '100%' }}> 
      {props.children} 
    </div>
  );
}

export default Renderer;
