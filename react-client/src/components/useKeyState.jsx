import { useState, useEffect } from 'react';

function useKeyState() {
  const [keyState, setKeyState] = useState({});

  useEffect(() => {
    const handleKeyDown = (event) => {
      setKeyState(prevState => ({ ...prevState, [event.code]: true }));
    };

    const handleKeyUp = (event) => {
      setKeyState(prevState => ({ ...prevState, [event.code]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keyState;
}

export default useKeyState;
