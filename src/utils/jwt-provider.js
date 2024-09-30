import jwt from "jsonwebtoken";
import { ObjectId } from "bson";

const secretKey = process.env.SECRET_KEY;
const expiresIn = process.env.EXPIRES_IN;

class JWTProvider {
  static LifeTime = parseInt(expiresIn / 60);
}

JWTProvider.generateToken = (sub, claims) => {
  return jwt.sign(
    {
      sub: sub,
      ...claims,
    },
    secretKey,
    { expiresIn: expiresIn }
  );
};

JWTProvider.getToken = (req) => {
  let token = req.header("authorization");
  if (token == undefined || !token.split(" ")[0].includes(`earer`))
    throw new Error(`Bad Credential`);
  token = token.split(" ")[1];

  return token;
};

JWTProvider.getTokenUser = (req) => {
  try {
    let token = JWTProvider.getToken(req);
    const user_id = jwt.verify(token, secretKey);
    return user_id;
  } catch (e) {
    return "Annonymous";
  }
};



JWTProvider.getSub = (req) => {
  try {
    let token = JWTProvider.getToken(req);
    const sub = jwt.verify(token, secretKey).sub;
    return sub;
  } catch (e) {
    return "Annonymous";
  }
};

JWTProvider.getBsonSub = (req) => {
  let sub = JWTProvider.getSub(req);
  if (ObjectId.isValid(sub)) return sub;
  return null;
};

JWTProvider.getObject = (req, key) => {
  try {
    let token = JWTProvider.getToken(req);
    const obj = jwt.verify(token, secretKey)[key];
    return obj;
  } catch (e) {
    console.log(e);
    return {};
    // return null;
  }
};



JWTProvider.verifyToken = (req) => {
  try {
    let token = JWTProvider.getToken(req);
    const username = jwt.verify(token, secretKey);
    return true;
  } catch (e) {
    return false;
  }
};
export default JWTProvider;
