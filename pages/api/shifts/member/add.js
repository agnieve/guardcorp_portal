import {connectDatabase} from "../../../../helpers/db-util";
import jwt from "jsonwebtoken";
import {ObjectId} from "mongodb";

async function handler(req, res) {

    if (req.method === 'POST') {

        const {shiftId, userId} = req.body;

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
            const secret = process.env.NEXTAUTH_SECRET;
            const token = req.headers.authorization.split(' ')[1];

            const payload = jwt.verify(token, secret);

            if (!payload) {
                throw new Error('Invalid Token');
            }

            const userExist = await db.collection('shift_members').findOne({
                'user._id': ObjectId(userId),
                'shift._id': ObjectId(shiftId)
            });

            if (userExist) {
                res.status(422).json({message: 'User Exist!'});
                await client.close();
                return;
            }

            const selectedShift = await db.collection('shifts').findOne({_id: ObjectId(shiftId)});
            const selectedUser = await db.collection('users').findOne({_id: ObjectId(userId)});

            if (!selectedShift) {
                res.status(422).json({message: 'Shift not found!'});
                await client.close();
                return;
            }

            if (!selectedUser) {
                res.status(422).json({message: 'User not found!'});
                await client.close();
                return;
            }

            const result = await db.collection("shift_members").insertOne({
                user: selectedUser,
                shift: selectedShift,
            });

            if (!result) {
                throw new Error('There was an error adding shift');
            }

            res.status(201).json(result);
            await client.close();

        } catch (error) {
            res.status(500).json({message: error});
            return;
        }

    }
}

export default handler;