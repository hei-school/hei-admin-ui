import {useState} from "react";

/**
 * @param initialValue coerced if not bool
 * @returns {[boolean, ((v) => void), (() => void)]} value, set, toggle
 */
export const useToggle = (initialValue) => {
  const [value, setValue] = useState(Boolean(initialValue));

  function toggle() {
    setValue((v) => !v);
  }

  /**
   * @param val is coerced if not bool
   */
  function set(val) {
    setValue(Boolean(val));
  }

  return [value, set, toggle];
};
