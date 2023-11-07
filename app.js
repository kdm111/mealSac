const express = require('express');

const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const fs = require('fs');
const { swaggerUi, specs } = require('./src/swagger');
const indexRouter = require('./src/routes/index.js');

dotenv.config();

const app = express();
const db = require('./src/models');
const { title } = require('process');
const PORT = process.env.PORT;

const reviewDirectory = path.join(
  __dirname,
  'src',
  'static',
  'img',
  'reviewImage',
);
if (!fs.existsSync(reviewDirectory)) {
  fs.mkdirSync(reviewDirectory, { recursive: true });
}

const postDirectory = path.join(__dirname, 'src', 'static', 'img', 'postImage');

if (!fs.existsSync(reviewDirectory)) {
  fs.mkdirSync(reviewDirectory, { recursive: true });
}

if (!fs.existsSync(postDirectory)) {
  fs.mkdirSync(postDirectory, { recursive: true });
}

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'src', 'static')));
app.use(express.json());
app.use('/static', express.static(__dirname + '/static'));

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000, // 1D
    },
  }),
);

app.use('/', indexRouter);

db.sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});

// app.listen(PORT, () => {
//   console.log(`http://localhost:${PORT}`);
// });
