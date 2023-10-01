const replyForm = document.querySelector('#replyForm')

const category = () => {
  history.back();
};

// 컨트롤러 완성 후 주석 풀기
const myPost = () => {
  const btnBox = document.querySelector('.btnBox');
  if (`${post.user_id}` === `${user.id}`) {
    btnBox.style.display = 'block';
  } else {
    btnBox.style.display = 'none';
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const replyForm = document.getElementById('replyForm');
  const loginStatus = getCookie('loginStatus');

  if (loginStatus === 'loggedIn') {
    replyForm.style.display = 'flex';
  } else {
    replyForm.style.display = 'none';
  }
});

// 댓글 등록
const enterReply = async (e) => {
  e.preventDefault();
  const replyForm = document.getElementById('replyForm');
  const postId = document.querySelector('.postBox').id;
  const formData = new FormData(replyForm);
  const replyContent = formData.get('replyContent');
  const response = await axios.post('/api/comment', {
    post_id : `${postId}`,
    content : `${replyContent}`
  })
  console.log(response)
};
replyForm.addEventListener('submit', enterReply)



// 수정
const modifyBtn = () => {
  const postId = document.querySelector('.postBox').id;
  location.href = `/post/edit/${postId}`;
};

// 삭제
const deleteBtn = async () => {
  const postId = document.querySelector('.postBox').id;

  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/post/${postId}`,
    });
    if (res.data.status === 'success') {
      location.href = '/board';
    }
  } catch (err) {
    console.log(err);
  }
};
