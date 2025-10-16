import { createContext } from "react";
import { doctors } from "../assets/assets";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

const AppContextProvider = (props) => {

    const currencySymbol = '$'

    const value = {
        doctors,
        currencySymbol
    };

    // FIX: Use AppContext.Provider instead of AppContextProvider
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;