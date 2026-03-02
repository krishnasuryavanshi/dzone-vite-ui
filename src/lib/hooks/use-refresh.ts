import React, { useReducer } from "react";

export function useRefresh() {
    const [, updateState] = useReducer((x) => x + 1, 0);
    return updateState;
}