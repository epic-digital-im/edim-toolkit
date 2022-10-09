import { useState, useEffect } from "react";

const useKeyPress = (targetKey: string, func: () => void) => {
  const downHandler = ({ key }: { key: string }) => {
    if (key === targetKey) {
      console.log("downHandler", key);
      if (func) func();
    }
  };

  const upHandler = ({ key }: { key: string }) => {
    if (key === targetKey) {
      console.log("upHandler", key);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);
}

export default useKeyPress;
