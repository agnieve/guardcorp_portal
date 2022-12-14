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

            const day1 = new Date();
            const day2 = new Date(user.licenseExpireDate);

            const difference= Math.abs(day2-day1);
            const days = difference/(1000 * 3600 * 24)

            if(days <= 7){
                const result = await db.collection("alert").insertOne({
                    eventId:'0000000', dateTime: day1, status: 'USER LICENSE TO EXPIRE'
                });
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
