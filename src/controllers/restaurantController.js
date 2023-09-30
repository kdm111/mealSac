const { Sequelize, Op } = require('sequelize');
const {
  ReviewUsefulness,
  ReviewImage,
  RestaurantType,
  Menu,
  Review,
  Tag,
  User,
  Restaurant,
  RestaurantImage,
  sequelize,
} = require('../models');
const dotenv = require('dotenv');
dotenv.config();
const { formatDate } = require('../utils/formatDate');

exports.getAllRestaurants = async (req, res) => {
  try {
    const { page } = req.query;
    const { id } =
      req.session && req.session.userInfo ? req.session.userInfo : -1;
    const response = await Restaurant.findAndCountAll({
      // attributes : ["restaurant_id", "restaurant_name", "likes_count", "reviews_count", "rating"],
      limit: 20,
      offset: 20 * (page - 1),
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
    });
    if (response.rows.length === 0) {
      throw Error();
    }
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
};

exports.getLikeRestaurants = async (req, res) => {
  try {
    const { page } = req.query;
    const { id } =
      req.session && req.session.userInfo ? req.session.userInfo : -1;
    const response = await Restaurant.findAndCountAll({
      // attributes : ["restaurant_id", "restaurant_name", "likes_count", "reviews_count", "rating"],
      limit: 20,
      offset: 20 * (page - 1),
      order: [
        ['likes_count', 'DESC'],
        ['rating', 'DESC'],
        ['reviews_count', 'DESC'],
      ],
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
    });
    console.log(response);
    if (response.rows.length === 0) {
      throw Error();
    }
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
};

exports.getRatingRestaurants = async (req, res) => {
  try {
    const { page } = req.query;
    const { id } =
      req.session && req.session.userInfo ? req.session.userInfo : -1;
    const response = await Restaurant.findAndCountAll({
      // attributes : ["restaurant_id", "restaurant_name", "likes_count", "reviews_count", "rating"],
      limit: 20,
      offset: 20 * (page - 1),
      order: [
        ['rating', 'DESC'],
        ['likes_count', 'DESC'],
        ['reviews_count', 'DESC'],
      ],
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
    });
    if (response.rows.length === 0) {
      throw Error();
    }
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
};
exports.getSearchRestaurantByName = async (req, res) => {
  try {
    const { q, page } = req.query;
    const { id } =
      req.session && req.session.userInfo ? req.session.userInfo : -1;
    const response = await Restaurant.findAndCountAll({
      // attributes : ["restaurant_id", "restaurant_name", "likes_count", "reviews_count", "rating"],
      limit: 20,
      where: { 
      restaurant_name: { 
        [Op.like] : `%` + `${q}` + `%`
      }},
      offset: 20 * (page - 1),
      order: [
        ['rating', 'DESC'],
        ['likes_count', 'DESC'],
        ['reviews_count', 'DESC'],
      ],
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
    });
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
};

exports.getRestaurant = async (req, res) => {
  const { id } = req.session && req.session.userInfo ? req.session.userInfo : 0;
  const { restaurant_id } = req.params;
  const restaurant = await Restaurant.findOne({
    include: [
      {
        model: User,
        where: { id: `${id}` },
        required: false,
      },
      {
        model: Tag,
        attributes: ['tag_id', 'tag_name'],
        required: false,
      },
      // {
      //   model: Review,
      //   attributes: ['review_id', 'user_id', 'rating', 'content', 'updatedAt'],
      //   order: [['updatedAt', 'DESC']],
      //   include: [
      //     {
      //       model: ReviewImage,
      //       limit: 1,
      //     },
      //   ],
      //   required: false,
      // },
      {
        model: Menu,
        attributes: ['menu_name', 'menu_price'],
        required: false,
      },
      {
        model: RestaurantType,
        attributes: ['restaurant_type'],
        as: 'restaurant_type',
      },
      {
        model: RestaurantImage,
        attributes: ['restaurant_image_url'],
        required: false,
      },
    ],
    where: { restaurant_id: restaurant_id },
  });
  // .then(restaurant => {
  //   res.render('restaurantDetail/index', {
  //     restaurant,
  //     googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
  //   });
  //   res.send(restaurant);
  // });
  return restaurant;
};

exports.createRestaurant = (req, res) => {
  const { restaurant_name } = req.body;
  restaurant
    .create({
      restaurant_name: restaurant_name,
    })
    .then(() => {
      res.send();
    });
};

exports.deleteRestaurant = (req, res) => {
  const { restaurant_id } = req.body;
  restaurant
    .destroy({
      where: { restaurant_id: restaurant_id },
    })
    .then(() => {
      res.status(204).send();
    });
};
