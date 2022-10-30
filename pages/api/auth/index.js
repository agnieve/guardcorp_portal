import jwt from "jsonwebtoken";
import {connectDatabase} from "../../../helpers/db-util";
import {verifyPassword} from "../../../helpers/auth-utils";


export default async function handler(req, res) {

    if (req.method === 'POST') {

        const {email, password} = req.body;

        // if (!email || !email.includes('@') || !password || password.trim().length < 7) {
        //     res.status(422).json({message: 'Invalid Input - password should also be at least 7 characters long.'});
        // }

        let client;
        let db;

        try {
            client = await connectDatabase();
            db = client.db();
        } catch (error) {
            res.status(500).json({message: "Connecting to the database failed"});
            return;
        }

        try {

            const userCollection = db.collection("users");

            const user = await userCollection.findOne({
                email: email,
                role: 'guard'
            });

            if (!user) {
                await client.close();
                throw new Error("No users found!");
            }

            const isValid = await verifyPassword(
                password,
                user.password
            );

            if (!isValid) {
                throw new Error("Could not log you in!");
            }

            await client.close();

            const secret = process.env.NEXTAUTH_SECRET;
            const jwt = require('jsonwebtoken');
            const token = jwt.sign({email: user.email, role: user.role}, secret);

            res.status(200).json({...user, ...{token: token}});
            return

        } catch (error) {
            res.status(500).json({message: error.message});
            return;
        }

    }
}
