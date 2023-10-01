const fs = require('fs');
const path = require('path');
const { User, Post, PostImage, Comment } = require('../models');

//post_id 값으로 특정 게시물 조회
exports.getPost = async (req, res) => {
  // [after]
  const { post_id } = req.params;
  const result = await Post.findOne({
    where: { post_id: post_id },
    attributes: [
      'title',
      'content',
      'user_id',
      'board_id',
      'post_id',
      'createdAt',
    ],
    include: [
      {
        model: User,
        attributes: ['user_name'],
      },
      {
        model: PostImage,
        attributes: ['image_url'],
      },
    ],
  });
  const comments = await Comment.findAll({
    where : {post_id : post_id},
    order : [['comment_id', 'DESC']],
    include : [{model : User}]
  })
  result.Comments = [...comments]
  res.render('boardPost', {
    post: result,
    formatDate: function (dateString) {
      const dateObj = new Date(dateString);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}.${month}.${day}`;
    },
  });
};

//내가 작성한 게시물 조회
exports.getMyPosts = async (req, res) => {
  const userInfo = req.session ? req.session.userInfo : null;

  //로그인 안되어 있는경우
  if (!userInfo || !userInfo.id) {
    return res.status(400).json({
      status: 'error',
      message: '세션에서 사용자 정보를 찾을 수 없습니다.',
    });
  }

  const user_id = userInfo.id;

  try {
    //포스트 제목, 작성날짜, 게시판 종류
    const myPosts = await Post.findAll({
      where: { user_id },
      attributes: ['title', 'content', 'post_id', 'createdAt'],
      include: [
        {
          model: PostImage,
          attributes: ['image_url'],
        },
      ],
      //작성날짜 최신순 정렬
      order: [['createdAt', 'DESC']],
    });
    //포스트가 없는 경우
    if (myPosts.length === 0) {
      return res.json({
        status: 'success',
        message: '사용자가 작성한 포스트가 없습니다.',
        data: [],
      });
    }
    //내 게시물 전송
    res.send(myPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: '포스트를 가져오는 동안 오류가 발생했습니다.',
    });
  }
};

//게시글 작성
exports.postCreatePost = async (req, res) => {
  const { id } =
    req.session && req.session.userInfo ? req.session.userInfo : -1;

  if (!req.session.userInfo) {
    return res.status(400).json({
      status: 'error',
      message: '세션에서 사용자 정보를 찾을 수 없습니다.',
    });
  }

  // const transaction = await sequelize.transaction();
  const { title, content, board_id } = req.body;

  //만약 board_id가 1이면 req.session.userInfo.admin_id가 0일경우 400에러
  //공지게시물에 올리려고 할 때 어드민아 아니라면 오류메세지 출력
  if (req.body.board_id == 1) {
    if (req.body.board_id == req.session.userInfo.isAdmin + 1) {
      return res.status(400).json({
        status: 'error',
        message: '관리자만 공지할 수 있습니다',
      });
    }
  }

  if (req.session.userInfo) {
    try {
      const newPost = await Post.create({
        title,
        content,
        user_id: id,
        board_id,
      });

      if (!newPost || !newPost.post_id) {
        return res.status(500).json({
          status: 'error',
          message: '포스트 생성에 실패했습니다.',
        });
      }

      const regex = /<img.*?src="(.*?)"[^>]+>/g;
      const matches = [];
      let match;
      while ((match = regex.exec(content))) {
        matches.push(match[1]);
      }

      const imagePromises = matches.map(src => {
        return PostImage.create({
          post_id: newPost.post_id,
          image_url: src,
        });
      });

      await Promise.all(imagePromises);

      res.status(201).json({
        status: 'success',
        message: '성공적으로 포스트를 등록했습니다.',
        post: {
          post_id: newPost.post_id,
          content: newPost.content,
          user_id: newPost.user_id,
        },
      });
    } catch (error) {
      console.error('에러 정보: ', error);
      res.status(500).json({
        status: 'error',
        message: '포스트를 등록하는 동안 오류가 발생했습니다.',
      });
    }
  } else {
    res.json({ result: false, message: '현재 로그인되어있지 않습니다.' });
  }
};

// 본인포스팅 삭제 or 관리자가 특정포스팅 삭제
exports.deletePost = async (req, res) => {
  console.log(req.session.userInfo);
  const userInfo = req.session ? req.session.userInfo : null;

  if (!userInfo || (!userInfo.id && !userInfo.isAdmin)) {
    return res.status(400).json({
      status: 'error',
      message: '세션에서 사용자 정보를 찾을 수 없습니다.',
    });
  }

  const user_id = userInfo.id;

  //포스트 아이디를 파라미터로 가져와서 삭제
  const { post_id } = req.params;

  try {
    const post = await Post.findOne({
      where: { post_id },
    });

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: '해당 포스팅을 찾을 수 없습니다.',
      });
    }

    // 리뷰 작성자 또는 관리자만 리뷰를 삭제할 수 있도록 함
    if (post.user_id !== user_id && !userInfo.isAdmin) {
      return res.status(403).json({
        status: 'error',
        message: '리뷰를 포스팅을 삭제할 권한이 없습니다.',
      });
    }
    await PostImage.destroy({ where: { post_id } });
    await post.destroy();

    res.json({
      status: 'success',
      message: '포스팅이 성공적으로 삭제되었습니다.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: '포스팅을 삭제하는 동안 오류가 발생했습니다.',
    });
  }
};

exports.getEditPost = async (req, res) => {
  const { post_id } = req.params;
  const result = await Post.findOne({
    where: { post_id: post_id },
    attributes: [
      'title',
      'content',
      'user_id',
      'board_id',
      'post_id',
      'createdAt',
    ],
    include: [
      {
        model: User,
        attributes: ['user_name'],
      },
      {
        model: PostImage,
        attributes: ['image_url'],
      },
    ],
  });
  res.render('boardModify', { post: result });
};

exports.updatePost = async (req, res) => {
  const { post_id } = req.params;

  const { title, content, board_id } = req.body;

  if (!req.session.userInfo) {
    return res.status(400).json({
      status: 'error',
      message: '로그인이 필요합니다.',
    });
  }

  try {
    const post = await Post.findOne({
      where: { post_id },
      include: [
        {
          model: PostImage,
          attributes: ['image_url'],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({
        status: 'error',
        message: '게시글을 찾을 수 없습니다.',
      });
    }

    // 기존에 연결된 이미지 삭제
    if (post.PostImages && post.PostImages.length) {
      post.PostImages.forEach(img => {
        fs.unlink(
          path.join(__dirname, '../static/img/postImage', img.image_url),
          err => {
            if (err) console.error(err);
          },
        );
      });
      await PostImage.destroy({ where: { post_id } });
    }

    // 새로운 이미지 저장
    const imagePromises = (req.files || []).map(file => {
      const filePath = path.join('/static/img/postImage', file.filename);
      return PostImage.create({
        post_id: post_id,
        image_url: filePath,
      });
    });
    await Promise.all(imagePromises);

    post.title = title;
    post.content = content;
    // post.board_id = board_id;
    await post.save();

    res.status(200).json({
      status: 'success',
      message: '게시글이 성공적으로 수정되었습니다.',
      post: {
        post_id: post_id,
        content: post.content,
        user_id: post.user_id,
      },
    });
  } catch (error) {
    console.error('에러 정보: ', error);
    res.status(500).json({
      status: 'error',
      message: '게시글을 수정하는 동안 오류가 발생했습니다.',
    });
  }
};
