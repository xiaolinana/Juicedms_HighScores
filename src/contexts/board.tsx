

import React, {useContext} from "react";

export const BoardContext = React.createContext({
    containerWidth: 0,
    tileCount: 4,
});

type Props = {
    cont