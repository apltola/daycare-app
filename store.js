import React from "react";
import useGlobalHook from "./useGlobalHook";
import * as actions from "./actions";

const initialState = {
  juukeli: 'juukeli'
};

const useGlobal = useGlobalHook(React, initialState, actions);
export default useGlobal;