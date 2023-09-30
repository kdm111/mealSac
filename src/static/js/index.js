const searchInput = document.querySelector('.searchInput')
const searchContainer = document.querySelector('.search')
const searchResult = document.querySelector('.searchResult')

searchInput.addEventListener('input', (e) => {
  search(e.target.value)
})

searchInput.addEventListener('focus', () => {
  searchResult.classList.remove('closeSearchResult')
  setTimeout(() => {
    searchContainer.style.borderRadius = '25px 25px 0 0';
    searchResult.style.display = 'block'
    searchResult.classList.add('showSearchResult')
  }, 250)
})

searchInput.addEventListener('focusout', () => {
  searchInput.value = ""
  searchResult.classList.add('closeSearchResult')
  setTimeout(() => {
    searchContainer.style.borderRadius = '25px';
    searchResult.classList.remove('showSearchResult')
    searchResult.style.display = 'none'
  }, 250)
})

const search = getResult(async keyword => {
  const searchRestaurantContainer = document.querySelector('#searchRestaurantContainer')
  const searchMenuContainer = document.querySelector('#searchMenuContainer')
  const restaurants = await axios({
    method : 'get',
    url : `/api/restaurant/search`,
    params : {
      page : 1,
      q : `${keyword}`
    },
    headers: {
      'Content-Type' : "application/json; charset=utf-8",
    }
  })
  const menus = await axios({
    method : 'get',
    url : `/api/menu/search`,
    params : {
      page : 1,
      q : `${keyword}`
    },
    headers: {
      'Content-Type' : "application/json; charset=utf-8",
    }
  })
  while (searchRestaurantContainer.firstChild) {
    searchRestaurantContainer.removeChild(searchRestaurantContainer.firstChild);
  }
  while (searchMenuContainer.firstChild) {
    searchMenuContainer.removeChild(searchMenuContainer.firstChild);
  }
  const restaurantTitle = document.createElement('h1')
  restaurantTitle.className = 'searchTitle'
  restaurantTitle.innerText = '식당'
  searchRestaurantContainer.append(restaurantTitle)
  const menuTitle = document.createElement('h1')
  menuTitle.innerText = '메뉴'
  menuTitle.className = 'searchTitle'
  searchMenuContainer.append(menuTitle)
  let i = 0; 
  if (restaurants.data.rows.length) {
    while (restaurants.data.rows && i < Math.min(3, restaurants.data.rows.length)) {
      const searchRestaurant = document.createElement('div')
      searchRestaurant.className = 'searchRestaurant'
      const searchImg = document.createElement('div')
      searchImg.className = 'searchImg'
      const imgUrl = 
        restaurants.data.rows[i].RestaurantImages.length !== 0 ? restaurants.data.rows[i].RestaurantImages[0].restaurant_image_url  : ""
      if (imgUrl) {
        searchImg.style.backgroundImage = `url(${imgUrl})`
      }
      searchRestaurant.append(searchImg)
      const searchRestaurantName = document.createElement('span')
      searchRestaurantName.className = 'searchMenuName'
      searchRestaurantName.innerText = `${restaurants.data.rows[i].restaurant_name}`
      searchRestaurant.append(searchRestaurantName)
      searchRestaurant.append(searchRestaurantName)
      searchRestaurant.setAttribute('onClick', `document.location.href='/restaurant/${restaurants.data.rows[i].restaurant_id}'`)
      searchRestaurantContainer.append(searchRestaurant)
      i += 1
    }
  } else {
    const searchRestaurant = document.createElement('div')
    searchRestaurant.innerText = '존재하지 않는 검색 결과입니다.'
    searchRestaurantContainer.append(searchRestaurant)
  }

  let j = 0; 
  if (menus.data.rows.length) {
    while (menus.data.rows && j < Math.min(3, menus.data.rows.length)) {
      const searchMenu = document.createElement('div')
      searchMenu.className = 'searchMenu'
      const searchImg = document.createElement('div')
      searchImg.className = 'searchImg'
  
      const imgUrl = 
      menus.data.rows[j].Restaurant && menus.data.rows[j].Restaurant.RestaurantImages.length !== 0 ? menus.data.rows[j].Restaurant.RestaurantImages[0].restaurant_image_url  : ""
      if (imgUrl) {
        searchImg.style.backgroundImage = `url(${imgUrl})`
      }
      searchMenu.append(searchImg)
      const searchMenuName = document.createElement('span')
      searchMenuName.className = 'searchMenuName'
      searchMenuName.innerHTML = `${menus.data.rows[j].menu_name}
        <span class='searchMenuName'; style='color:gray;'>
          (${menus.data.rows[j].Restaurant.restaurant_name})
        </span>`
      searchMenu.append(searchMenuName)
      searchMenu.setAttribute('onClick', `document.location.href='/restaurant/${menus.data.rows[j].restaurant_id}'`)
      searchMenuContainer.append(searchMenu)
      j += 1
    }
  } else {
    const searchMenu = document.createElement('div')
    searchMenu.innerText = '존재하지 않는 결과입니다.'
    searchMenuContainer.append(searchMenu)
  }
}, 500)

function getResult(cb, delay) {
  let timeId;
  return async (...args) =>  {
    clearTimeout(timeId)
    timeId = setTimeout(() => {
      cb(...args)
    }, delay)
  }
}

document.addEventListener('DOMContentLoaded', function () {  
  const cardContainer = document.querySelector('.likeCards');
  const nextButton = document.querySelector('.slide-btn.next');
  const prevButton = document.querySelector('.slide-btn.prev');
  const cardWidth = cardContainer.querySelector('.cardContainer').offsetWidth;
  let slideIndex = 0;

  nextButton.addEventListener('click', function () {
    if (slideIndex < cardContainer.children.length - 4) {
      slideIndex++;
      updateSlidePosition(cardContainer, slideIndex, cardWidth);
    }
  });

  prevButton.addEventListener('click', function () {
    if (slideIndex > 0) {
      slideIndex--;
      updateSlidePosition(cardContainer, slideIndex, cardWidth);
    }
  });

  function updateSlidePosition(cardContainer, slideIndex, cardWidth) {
    const offset = -cardWidth * slideIndex;
    cardContainer.style.transform = `translateX(${offset}px)`;
  }
});

// 스크롤 이벤트
document.addEventListener('DOMContentLoaded', function () {
  const scrollButton = document.getElementById('scroll');

  scrollButton.addEventListener('click', function () {
    scrollButton.scrollIntoView({ behavior: 'smooth' });
  });
});

// 검색 기능
// document.addEventListener('DOMContentLoaded', function () {
//   const searchInput = document.querySelector('.searchInput');
//   let mainSearch = null;

//   searchInput.addEventListener('keyup', function (event) {
//     if (event.key === 'Enter') {
//       const apiUrl = `/api/menu/search?q=${searchInput.value}&page=1`;

//       fetch(apiUrl)
//         .then(response => response.json())
//         .then(data => {
//           mainSearch = data;
//           console.log(mainSearch);
//         })
//         .catch(error => {
//           console.error('API 요청 실패:', error);
//         });
//     }
//   });
// });

// ===============================
// document.addEventListener('DOMContentLoaded', function () {
//   const slideGroups = document.querySelectorAll('.restaurants');

//   slideGroups.forEach(group => {
//     const cardContainer = group.querySelector('.cardMenu');
//     const cards = cardContainer.querySelectorAll('.card-container');
//     const cardWidth = cards[0].offsetWidth;
//     let slideIndex = 0;

//     group
//       .querySelector('.slide-btn.next')
//       .addEventListener('click', function () {
//         if (slideIndex < cards.length - 4) {
//           slideIndex += 4;
//           updateSlidePosition(cardContainer, slideIndex, cardWidth);
//         }
//       });
//   });

//   function updateSlidePosition(cardContainer, slideIndex, cardWidth) {
//     const offset = -cardWidth * slideIndex;
//     cardContainer.style.transform = `translateX(${offset}px)`;
//   }
// });

// // 검색 기능을 추가
// const searchForm = document.getElementById('searchForm');
// const searchInput = document.getElementById('searchInput');

// searchForm.addEventListener('submit', function (e) {
//   const searchQuery = searchInput.value.trim();

//   if (searchQuery) {
//     // 검색어가 있을 경우, 폼의 action을 수정
//     searchForm.action = `/restaurants?query=${encodeURIComponent(searchQuery)}`;
//   } else {
//     // 검색어가 없을 경우, 폼의 action을 기본 경로로 설정
//     searchForm.action = '/restaurants';
//   }
// });



