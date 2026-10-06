import {useState} from "react";

type ToggleReturnType = [boolean, (newValue: boolean) => void, () => void];

export const useToggle = (initialState = false): ToggleReturnType => {
  const [visible, setVisible] = useState(initialState);
  const changeVisibility = (value: boolean) => setVisible(value);
  const toggle = () => setVisible((prev) => !prev);

  return [visible, changeVisibility, toggle];
};
