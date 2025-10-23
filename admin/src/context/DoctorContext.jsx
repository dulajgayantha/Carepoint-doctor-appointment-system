import { createContext } from "react";
// eslint-disable-next-line react-refresh/only-export-components
export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {

    const value = {
    
    };

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    );
};

export default DoctorContextProvider;