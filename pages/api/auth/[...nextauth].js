import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import {verifyPassword} from "../../../helpers/auth-utils";
import {connectDatabase} from "../../../helpers/db-util";
import jwt from "jsonwebtoken";

const THIRTY_DAYS = 30 * 24 * 60 * 60;
const THIRTY_MINUTES = 30 * 60;

export const authOptions = {
    // Configure one or more authentication providers
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },

    providers: [
        CredentialsProvider({
            async authorize(credentials, req) {
                const client = await connectDatabase();

                const userCollection = client.db().collection("users");

                const user = await userCollection.findOne({
                    email: credentials.email,
                    role:'admin'
                });

                if (!user) {
                    await client.close();
                    throw new Error("No users found!");
                }

                const isValid = await verifyPassword(
                    credentials.password,
                    user.password
                );

                if (!isValid) {
                    throw new Error("Could not log you in!");
                }

                await client.close();

                return {email: user.email, role: user.role};
            },

        })
    ],
    callbacks: {
        async session({session, user, token}) {

            session.user.role = token.role;
            session.user.accessToken = jwt.sign(token, process.env.NEXTAUTH_SECRET);
            return session;
        },
        async jwt({token, user, account, profile, isNewUser}) {

            if (user) {
                token.role = user.role
                // var jwt = require('jsonwebtoken');
                // var token = jwt.sign({email: users.email, role: users.role}, process.env.NEXTAUTH_SECRET);
                // console.log(token);
            }


            return token
        },
    }
}
export default NextAuth(authOptions)