import { useContext,createContext,useState } from "react";

const UserType = createContext();

const UserContext = ({children})=>{
    const [userId,setUserId] = useState('');
    const [userInfo,setUserInfo] = useState(null)

    return <UserType.Provider value={{userId,setUserId,userInfo,setUserInfo}} >{children}</UserType.Provider>
}

export const useUserContext = ()=>useContext(UserType)

export default UserContext;