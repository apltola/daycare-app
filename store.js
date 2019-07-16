import React from "react";
import useGlobalHook from "./useGlobalHook";
import * as actions from "./actions";

const initialState = {
  juukeli: 'juukeli',
  auth: {
    id: 1,
    groupId: 1001,
    name: 'allu'
  }
};

const useGlobal = useGlobalHook(React, initialState, actions);
export default useGlobal;