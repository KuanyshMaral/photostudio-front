import { useEffect } from 'react';

export const useBodyScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (isLocked) {
      // Add a class to the body that disables scrolling
      document.body.classList.add('modal-open');
    } else {
      // Remove the class to restore scrolling
      document.body.classList.remove('modal-open');
    }

    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isLocked]);
};
