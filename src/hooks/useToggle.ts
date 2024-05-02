import {useState} from "react";

type ToggleReturnType = [boolean, (newValue: boolean) => void, () => void];

export const useToggle = (initialState = false): ToggleReturnType => {
  const [visible, setVisibility] = useState(initialState);
  const changeVisibility = (value: boolean) => setVisibility(value);
  const toggle = () => setVisibility((prev) => !prev);

  return [visible, changeVisibility, toggle];
};
