const express = require('express');
const router = express.Router();
const userRouter = require('./userRouter.js');
const restaurantRouter = require('./restaurantRouter.js');
const restaurantTypeRouter = require('./restaurantTypeRouter.js');
const reviewRouter = require('./reviewRouter.js');
const likeRestaurantRouter = require('./likeRestaurantRouter.js');
const menuRouter = require('./menuRouter.js');
const tagRouter = require('./tagRouter.js');
const indexRouter = require('./indexRouter.js');
const postRouter = require('./postRouter.js');
const oauthRouter = require('./oauthRouter.js');
const boardRouter = require('./boardRouter.js');
const commentRouter = require('./commentRouter.js');

router.use('/api/user', userRouter);
router.use('/api/restaurant', restaurantRouter);
router.use('/api/restaurant_type', restaurantTypeRouter);
router.use('/api/review', reviewRouter);
router.use('/api/like', likeRestaurantRouter);
router.use('/api/menu', menuRouter);
router.use('/api/tag', tagRouter);
router.use('/api/post', postRouter);
router.use('/api/oauth', oauthRouter);
router.use('/api/board', boardRouter);
router.use('/api/comment', commentRouter);

router.use('/', indexRouter);

module.exports = router;
