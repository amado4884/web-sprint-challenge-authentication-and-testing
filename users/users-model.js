const knex = require("knex");
const env = process.env.NODE_ENV || "development";
const db = knex(require("../knexfile")[env]);

const find = async () => {
  return await db("users");
};

const findById = async (id) => {
  return await db("users").where({ id }).first();
};

const findByUsername = async (username) => {
  return await db("users").where({ username }).first();
};

const add = async (user) => {
  return await db("users").insert(user);
};

const remove = async (id) => {
  return await db("users").where({ id }).del();
};

const update = async (id, data) => {
  return await db("users").where({ id }).first().update(data);
};

module.exports = {
  find,
  findById,
  add,
  remove,
  update,
  findByUsername,
};
