import { Helmet } from 'react-helmet-async';
// sections
import ResetPassword from '../../sections/auth/ResetPassword';
import Login from '../../sections/auth/Login';
// import Login from '../../sections/auth/LoginAuth0';

// ----------------------------------------------------------------------

export default function ResetPasswordPage() {
    return (
        <>
            <Helmet>
                <title> Reset password | Minimal UI</title>
            </Helmet>

            <ResetPassword />
        </>
    );
}
