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

JWTProvider.getBsonPartner = (req) => JWTProvider.getObject(req, "partner")["_id"];

JWTProvider.getUsername = (req) => {
  try {
    let token = JWTProvider.getToken(req);
    const username = jwt.verify(token, secretKey).username;
    return username;
  } catch (e) {
    return "Annonymous";
  }
};

JWTProvider.getCompanyId = (req) => {
  try {
    let token = JWTProvider.getToken(req);
    const company_id = jwt.verify(token, secretKey).company_id;
    return company_id;
  } catch (e) {
    console.log(e);
    throw e;
    // return null;
  }
};

JWTProvider.getBsonCompany = (req) => {
  let sub = JWTProvider.getCompanyId(req);

  if (ObjectId.isValid(sub)) return sub;
  return null;
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

JWTProvider.getScope = (req) => {
  try {
    let token = JWTProvider.getToken(req);
    return jwt.verify(token, secretKey).scopes;
  } catch (e) {
    return null;
  }
};
JWTProvider.getPartnerType = (req) => {
  try {
    let token = JWTProvider.getToken(req);
    const partner_type = jwt.verify(token, secretKey).partner_type;
    return partner_type;
  } catch (e) {
    console.log(e);
    throw e;
    // return null;
  }
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

JWTProvider.getClaims = (req) => {
  try {
    let token = JWTProvider.getToken(req);
    return jwt.verify(token, secretKey).claims;
  } catch (e) {
    console.log(e);
    return null;
  }
};

JWTProvider.containScope = async (scope, req) => {
  try {
    const scopes = JWTProvider.getScope(req);
    if (
      scopes == null ||
      scopes[scope.title] == undefined ||
      scopes[scope.title][scope.menu] == undefined ||
      scopes[scope.title][scope.menu].indexOf(scope["scope"]) == -1
    ) {
      return false;
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
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
