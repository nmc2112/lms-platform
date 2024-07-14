import { Children } from "react";

const AuthLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return ( 
        <div style={{ background: 'linear-gradient(to right, #2a5298, #1e3c72)', height: '100%' }} className="flex items-center justify-center">
            {children}
        </div>
    );
}
 
export default AuthLayout;
