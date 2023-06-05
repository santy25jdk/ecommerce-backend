const User = require("../models/User");
const sequelize = require("../utils/connection");
require("../models");
require("../models/User");
require("../models/Category");
require("../models/Product");
require("../models/Cart");
require("../models/Purchase");

const main = async () => {
  try {
    await sequelize.sync({ force: true });

    await User.create({
      firstName: "usertest",
      lastName: "usertest",
      email: "usertest@gmail.com",
      password: "usertest",
      phone: "2974008515",
    });

    process.exit();
  } catch (error) {
    console.log(error);
  }
};

main();
