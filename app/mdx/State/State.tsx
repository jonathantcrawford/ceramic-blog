import { useState } from "react";

export const State = ({initialState, render}: any) => {
    const [state, setState] = useState(initialState);
    return render({state, setState});
}