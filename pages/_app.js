import '../styles/globals.css'
import {SessionProvider} from "next-auth/react";
import Layout from "../components/layout/layout";

function MyApp({Component, session, ...pageProps}) {

    return (
        <SessionProvider session={session}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </SessionProvider>
    );
}

export default MyApp
