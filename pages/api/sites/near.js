import jwt from "jsonwebtoken";
import {connectDatabase, getAllDocuments} from "../../../helpers/db-util";
import {getDistanceBetweenPoints} from "../../../helpers/map-util";


export default async function handler(req, res) {

    if (req.method === 'POST') {

        const {latitude, longitude} = req.body;

        let client;

        try {
            client = await connectDatabase();
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

            const documents = await getAllDocuments(client, "sites");
            const result = documents.map(site => {

                const meters = getDistanceBetweenPoints(+(site.latitude), +(site.longitude), +(latitude), +(longitude));
                console.log(meters);

                return {
                    _id: site._id,
                    siteName: site.siteName,
                    address: site.address,
                    clientId: site.clientId,
                    latitude: site.latitude,
                    longitude: site.longitude,
                    complianceInformation: site.complianceInformation,
                    distanceFromSite: meters
                };

            });

            res.status(200).json(result);

        } catch (error) {
            res.status(500).json({message: error.message});
            return;
        }
    }

}
