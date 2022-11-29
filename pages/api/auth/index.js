import jwt from "jsonwebtoken";
import {connectDatabase} from "../../../helpers/db-util";
import {verifyPassword} from "../../../helpers/auth-utils";


export default async function handler(req, res) {

    if (req.method === 'POST') {

        const {licenseNumber} = req.body;

        if (!licenseNumber) {
            res.status(422).json({message: 'Invalid Input - License number is required'});
        }

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
                licenseNumber: licenseNumber,
            });

            if (!user) {
                await client.close();
                throw new Error("No user found!");
            }

            await client.close();

            const secret = process.env.NEXTAUTH_SECRET;
            const jwt = require('jsonwebtoken');
            const token = jwt.sign({licenseNumber: user.licenseNumber}, secret);

            res.status(200).json({...user, ...{token: token}});
            return

        } catch (error) {
            res.status(500).json({message: error.message});
            return;
        }

    }
}
