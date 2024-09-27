import "regenerator-runtime/runtime";
import "core-js/stable";
import mysql2 from "mysql2";
require("dotenv").config();

export default async (callback) => {
  let client;
  try {
    client = mysql2.createPool({
      "username": process.env.USER,
      "password": process.env.PASSWORD,
      "database": process.env.DB,
      "host": process.env.HOST
    })
  } catch (error) {
    console.log(error)
  }
  callback(client);
};