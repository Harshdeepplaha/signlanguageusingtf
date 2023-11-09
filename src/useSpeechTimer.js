import { useState, useEffect } from "react";

function useSpeechTimer(initialValue) {
  const [currentlySpokenClass, setCurrentlySpokenClass] = useState(initialValue);
  const [speechTimer, setSpeechTimer] = useState(null);

  const speakClassName = (className) => {
    const utterance = new SpeechSynthesisUtterance(className);
    speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (currentlySpokenClass) {
      const timer = setTimeout(() => {
        setCurrentlySpokenClass(null);
      }, 5000);
      setSpeechTimer(timer);
    }
  }, [currentlySpokenClass]);

  return { currentlySpokenClass, setCurrentlySpokenClass, speakClassName };
}

export default useSpeechTimer;
