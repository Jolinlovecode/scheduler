import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]); 
  

  function transition(newMode, replace = false) {

    setMode(newMode);

    if (replace === false) { 
    //[1,2,3] => [1,2,3,4]
      setHistory(prev => [...prev, newMode]);
    } else {
    //[1,2,3] =>[1,2,4]
      setHistory(prev => [...prev.slice(0, -1), newMode]);
    }
  };
  
  function back() { 
    if (history.length === 1) return;

    setHistory(history.slice(0,-1));
    setMode(history[history.length - 2]);
  };

  return { mode, transition, back };
};