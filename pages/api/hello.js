import jwt from "jsonwebtoken";


export default async function handler(req, res) {

  const secret = process.env.NEXTAUTH_SECRET;
  console.log(secret);
  const token = req.headers.authorization.split(' ')[1];
  const payload = jwt.verify(token, secret);
  console.log(payload);
  res.end();
}
