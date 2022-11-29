import '../styles/globals.css'
import {SessionProvider} from "next-auth/react";
import Layout from "../components/layout/layout";
import {QueryClientProvider, QueryClient} from '@tanstack/react-query';

function MyApp({Component, session, ...pageProps}) {

    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider session={session}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </SessionProvider>
        </QueryClientProvider>

    );
}

export default MyApp
