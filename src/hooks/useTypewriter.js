import { useState, useEffect } from 'react';

/**
 * ⌨️ useTypewriter Hook
 * Cycles through an array of strings with a typing/deleting effect.
 * * @param {string[]} words - Array of strings to cycle through
 * @param {number} typingSpeed - ms per character (default 150)
 * @param {number} deletingSpeed - ms per character (default 100)
 * @param {number} pauseDuration - ms to wait before deleting (default 2000)
 * @returns {string} - The current text being typed
 */
export const useTypewriter = (words, typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeedState, setTypingSpeedState] = useState(typingSpeed);

  useEffect(() => {
    const i = loopNum % words.length;
    const fullText = words[i];

    const handleType = () => {
      setText(current => 
        isDeleting 
          ? fullText.substring(0, current.length - 1) 
          : fullText.substring(0, current.length + 1)
      );

      // Dynamic Speed Logic
      let typeSpeed = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && text === fullText) {
        // Finished typing word, pause before deleting
        typeSpeed = pauseDuration;
        setIsDeleting(true);
      } else if (isDeleting && text === '') {
        // Finished deleting, switch to next word
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        typeSpeed = 500; // Small pause before typing next word
      }

      setTypingSpeedState(typeSpeed);
    };

    const timer = setTimeout(handleType, typingSpeedState);

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, words, typingSpeed, deletingSpeed, pauseDuration, typingSpeedState]);

  return text;
};
