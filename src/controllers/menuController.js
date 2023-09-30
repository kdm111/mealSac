const { Restaurant, Menu, RestaurantImage, User } = require('../models');
const { Op } = require('sequelize');

exports.searchMenu = async (req, res) => {
  try {
    const { q, page } = req.query;
    const { id } =
      req.session && req.session.userInfo ? req.session.userInfo : -1;
    const response = await Menu.findAndCountAll({
      include: [
        {
          model: Restaurant,
          include: [
            {
              model: User,
              where: { id: id ? id : 0 },
              required: false,
            },
            {
              model: RestaurantImage,
              attributes: ['restaurant_image_url'],
              limit: 1,
            },
          ],
        },
      ],
      limit: 20,
      offset: 20 * (page - 1),
      where: {
        menu_name: {
          [Op.like]: `%${q}%`,
        },
      },
    })
    res.json(response)
  } catch (error) {
    console.log(error)
    res.status(500).send();
  }
};

exports.getRestaurantMenu = (req, res) => {
  const { restaurant_id } = req.params;
  Menu.findAll({
    where: { restaurant_id: restaurant_id },
  }).then(response => {
    res.send(response);
  });
};
