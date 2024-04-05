import { useRoutes } from "react-router-dom";
import { Routes } from "../../routes"


const AllRoute = () => {
    const element = useRoutes(Routes)
    return (
        <>
            {element}
        </>
    )
}

export default AllRoute