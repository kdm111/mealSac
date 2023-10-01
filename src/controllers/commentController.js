const {User, Post, Comment} = require('../models')


exports.createComment = (req, res) => {
  try {
    const {id} = req?.session?.userInfo
    const {post_id, content} = req?.body
    if (!id || !post_id || !content) {
      res.status(400).send()
    }
    Comment.create({
      user_id : id,
      post_id : post_id,
      content : content
    })
    .then((response) => {
      res.status(201).send(response)
    })
    .catch((error) => {
      console.error(error)
      res.status(500).send()
    })
  } catch (error) {
    console.error(error)
    res.status(500).send()
  }
}

exports.updateComment = (req, res) => {
  try {
    const {comment_id, content} = req.body
    if (comment_id && content) {
      Comment.findOne({
        where : {comment_id : comment_id}
      })
      .then((response) => {
        if (response.dataValues && (response.dataValues.user_id === req.session.userInfo.id)) {
          Comment.update(
            {
              content : content
            }, 
            {
              where : {comment_id : comment_id}
            }
          )
          .then(() => {
            res.send("잘 수정되었습니다.")
          })
          .catch((error) => {
            console.log(error)
        })}
        else {
          res.status(400).send()
        }
      })
    } else {
      throw Error()
    }
  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

exports.deleteComment = async (req, res) => {
  try {
    const {comment_id} = req.body
    if (comment_id) {
      Comment.findOne({
        where : {comment_id : comment_id}
      })
      .then((response) => {
        if (response && (response.dataValues.user_id === req.session.userInfo.id)) {
          Comment.destroy({
            where : {comment_id : comment_id}
          })
          .then(() => {
            res.send("잘 삭제되었습니다.")
          })
          .catch(() => {
            throw Error()
          })
        } else {
          res.status(400).send()
        }
      })
    } else {
      throw Error()
    }
  } catch (error) {
    console.log(error)
    res.send(error)
  }
}