import jwt from "jsonwebtoken";

export const generateToken = async (object) => {
  try {
    const secret = process.env.APP_COVID_SECRET_TEXT;
    const token = jwt.sign(object, secret);
    return token;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const validateToken = async (token) => {
  try {
    if (token) {
      const secret = process.env.APP_COVID_SECRET_TEXT;
      const decode = jwt.verify(token, secret);
      return decode;
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
