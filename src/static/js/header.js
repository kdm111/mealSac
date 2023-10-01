let isLoggedIn = false;

// DOM 참조 초기화
const loginBtn = document.querySelector('.login');
const registerBtn = document.querySelector('.register');
const logoutBtn = document.querySelector('.logout');
const mypageBtn = document.querySelector('.mypage');
const hamburgerMenu = document.querySelector('.hamburger');
const mobileLoginBtn = document.querySelector('.mobile-login');
const loggedOutDiv = document.querySelector('.logged-out');
const loggedInDiv = document.querySelector('.logged-in');
const dropdown = document.querySelector('.dropdown-content');
const darkModeBtn = document.querySelector('#darkModeBtn')
const header = document.querySelector('.header')

darkModeBtn.addEventListener('click', (e) => {
  if (e.target.innerText === 'Dark') {
    e.target.innerText = 'Bright'
  } else {
    e.target.innerText = 'Dark'
  }
  loginBtn.classList.toggle('dark-btn')
  registerBtn.classList.toggle('dark-btn')
  header.classList.toggle('dark')

  const sesacDarkMode = window.localStorage.getItem('sesac')
  if (sesacDarkMode) {
    localStorage.setItem('sesacDarkMode' ,false)
  } else {
    localStorage.setItem('sesacDarkMode' ,true)
  }
  console.log(sesacDarkMode)

})

const updateButtonVisibility = () => {
  const isMobileOrFolded = window.innerWidth <= 480;

  if (isLoggedIn) {
    if (isMobileOrFolded) {
      hamburgerMenu.style.display = 'inline-block';
      loginBtn.style.display = 'none';
      registerBtn.style.display = 'none';
      logoutBtn.style.display = 'none';
      mypageBtn.style.display = 'none';
    } else {
      logoutBtn.style.display = 'inline-block';
      mypageBtn.style.display = 'inline-block';
      hamburgerMenu.style.display = 'none';
      loginBtn.style.display = 'none';
      registerBtn.style.display = 'none';
    }

    loggedOutDiv.style.display = 'none';
    loggedInDiv.style.display = 'block';
  } else {
    if (isMobileOrFolded) {
      hamburgerMenu.style.display = 'none';
      loginBtn.style.display = 'none';
      registerBtn.style.display = 'none';
      logoutBtn.style.display = 'none';
      mypageBtn.style.display = 'none';
    } else {
      loginBtn.style.display = 'inline-block';
      registerBtn.style.display = 'inline-block';
      hamburgerMenu.style.display = 'none';
      logoutBtn.style.display = 'none';
      mypageBtn.style.display = 'none';
    }

    loggedOutDiv.style.display = 'block';
    loggedInDiv.style.display = 'none';
  }

  dropdown.style.display = 'none'; // 드롭다운 메뉴 초기화
};

const toggleLoginStatus = status => {
  isLoggedIn = status;
  updateButtonVisibility();
};

function getLoginStatusFromCookie() {
  let loginStatus = getCookie('loginStatus');
  return loginStatus === 'loggedIn';
}

function getCookie(name) {
  let value = '; ' + document.cookie;
  let parts = value.split('; ' + name + '=');
  if (parts.length === 2) return parts.pop().split(';').shift();
}

isLoggedIn = getLoginStatusFromCookie();
updateButtonVisibility();

loginBtn.addEventListener('click', () => {
  document.cookie = 'loginStatus=loggedIn; path=/; max-age=3600';
  toggleLoginStatus(true);
});

logoutBtn.addEventListener('click', () => {
  document.cookie =
    'loginStatus=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  toggleLoginStatus(false);
  window.location.reload();
});

mobileLoginBtn.addEventListener('click', () => {
  document.cookie = 'loginStatus=loggedIn; path=/; max-age=3600';
  toggleLoginStatus(true);
});

hamburgerMenu.addEventListener('click', () => {
  dropdown.style.display =
    dropdown.style.display === 'block' ? 'none' : 'block';
});

const mobileLogout = document.querySelector('.mobileLogout');

mobileLogout.addEventListener('click', () => {
  document.cookie =
    'loginStatus=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  toggleLoginStatus(false);
  window.location.reload();
});

window.addEventListener('resize', updateButtonVisibility); // 반응형 사이즈 변경에 대응
