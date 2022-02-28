import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]); 
  

  function transition(mode, replace = false) {
    setMode(mode);
    if (replace === false) { 
      const newHistory = [...history, mode];   //[1,2,3] => [1,2,3,4]
      setHistory(newHistory);
    } else {
      const newHistory = [...history.slice(0,-1),mode];    //[1,2,3] =>[1,2,4]
      setHistory(newHistory);
    }
  };
  
  function back() { 
    if (history.length === 1) return;

    setHistory(history.slice(0,-1));
    setMode(history[history.length - 2]);
  };

  return { mode, transition, back };
};