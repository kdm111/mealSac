const likeList = () => {
  document.getElementById('myLike').classList.add('clicked');
  document.getElementById('myReview').classList.remove('clicked');
  document.getElementById('myLikes').style.display = 'block';
  document.getElementById('myReviews').style.display = 'none';
};

const reviewList = () => {
  document.getElementById('myReview').classList.add('clicked');
  document.getElementById('myLike').classList.remove('clicked');
  document.getElementById('myReviews').style.display = 'block';
  document.getElementById('myLikes').style.display = 'none';
};