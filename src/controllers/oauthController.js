const axios = require('axios')
const rest = "0cee9e4fe5f244869b2caf837039c13d"
const {User} = require('../models')

exports.kakaoLogin = (req, res) => {
  res.redirect(`https://kauth.kakao.com/oauth/authorize?client_id=${rest}&response_type=code&redirect_uri=http://127.0.0.1:8000/api/oauth/kakao/result`)

}

exports.kakaoResult = async (req, res) => {
  const code = req.query.code
  const response = await axios.post(
    'https://kauth.kakao.com/oauth/token', 
    {
      "grant_type" : "authorization_code",
      "client_id" : `${rest}`,
      "redirect_uri" : "http://127.0.0.1:8000/api/oauth/kakao/result",
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
  console.log(getUserInfo.data.properties)
  console.log(getUserInfo.data)
  let user = await User.findOne({
    where : {user_id : `${getUserInfo.data.id}@kakao.com`},
  })
  if (!user) {
    user = await User.create({
      user_id : `${getUserInfo.data.id}@kakao.com`,
      password : "",
      user_name : `${getUserInfo.data.id}kakao`
    })
  } 
  req.session.userInfo = {user_name : `${user.dataValues.user_name}`, id : `${user.dataValues.id}`}
  res.redirect('/')
}