const { Op } = require("sequelize");

export const SEARCH_QUERY = {
  ROLE: "ROLE",
};

const queryDate = (query, reqObject) => {
  if (reqObject["start_date"]) {
    let startDate = new Date(reqObject["start_date"]);
    startDate.setHours(0);

    if (query.createdAt == undefined) query.createdAt = {};
    query.createdAt[Op.gte] = startDate;
  }

  if (reqObject["end_date"]) {
    let endDate = new Date(reqObject["end_date"]);
    endDate.setHours(24);

    if (query.createdAt == undefined) query.createdAt = {};
    query.createdAt[Op.lt] = endDate;
  }

  return query;
};


export const queryRole = (req) => {
  let query = {};
  let reqObject = req.query;
  let { id, search_all, status } = req.query;

  if (id) query.id = id;

  let regex = {[Op.like]: search_all+'%'}
  if (search_all) {
    query[Op.and] = [
      {
        [Op.or]: [
          { role_name: regex },
          { type: regex },
        ]
      }
    ]
  }

  query = queryDate(query, reqObject);

  return query;
};
