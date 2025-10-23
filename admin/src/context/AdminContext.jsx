import { createContext , useState} from "react";
// eslint-disable-next-line react-refresh/only-export-components
export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [aToken, setAToken] = useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):'')
    const backendUrl = import.meta.env.VITE_BACKENDURL

    const value = {
        aToken,setAToken,
        backendUrl,
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;