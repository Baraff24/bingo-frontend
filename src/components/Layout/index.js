import { Outlet } from "react-router-dom";
import Footer from "../Footer";
import Header from "../Header";

const Layout = () => {
    return (
        <>
            <div className="space-background">
                <Header />

                <Outlet />
            </div>
            <Footer/>

        </>
    )
};

export default Layout;