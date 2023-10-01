const axios = require('axios')
const rest = process.env.KAKAO_REST_API_KEY
const {User} = require('../models')

exports.kakaoLogin = (req, res) => {
  res.redirect(`https://kauth.kakao.com/oauth/authorize?client_id=${rest}&response_type=code&redirect_uri=${req.protocol}://${req.get('Host')}/api/oauth/kakao/result`)
}

exports.kakaoResult = async (req, res) => {
  const code = req.query.code
  const response = await axios.post(
    'https://kauth.kakao.com/oauth/token', 
    {
      "grant_type" : "authorization_code",
      "client_id" : `${rest}`,
      "redirect_uri" : `${req.protocol}://${req.get('Host')}/api/oauth/kakao/result`,
      "code" : `${code}`
    },
    {
      headers : {
        "Content-type" : "application/x-www-form-urlencoded;charset=utf-8"
      }
    }
  )
  const {access_token} = response.data
  const getUserInfo = await axios.get(
    'https://kapi.kakao.com/v2/user/me', {
      headers : {
        "Authorization" : `Bearer ${access_token}`,
        "Content-type" : `application/x-www-form-urlencoded;charset=utf-8`
      }
    }
  )
  let user = await User.findOne({
    where : {user_id : `${getUserInfo.data.id}@kakao.com`},
  });
  let alertMsg = user ? '로그인을 환영합니다!' : '회원가입을 환영합니다!'
  if (!user) {
    user = await User.create({
      user_id : `${getUserInfo.data.id}@kakao.com`,
      password : "",
      user_name : `kakao_${getUserInfo.data.id}`
    });
  }
  req.session.userInfo = {user_name : `${user.dataValues.user_name}`, id : `${user.dataValues.id}`};
  res.send(`<script>location.href='/'; alert('${alertMsg}');</script>`);
}