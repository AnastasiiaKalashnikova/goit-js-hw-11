import { Report } from 'notiflix/build/notiflix-report-aio';
import axios from "axios";

const URL = 'https://pixabay.com/api/'
const API_KEY = '39890797-00190d6beecffd2ffd1001b1e'
const seachParams = new URLSearchParams({
    key:API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: 40
})
let currentPage = 1;
let inputValue = ''


const form = document.querySelector('.js-form')
const gallery = document.querySelector('.js-gallery')
const btn = document.querySelector('.js-btn')
const loader = document.querySelector('.js-load-btn')




form.addEventListener('submit', forSearch)

    function forSearch(evt) {
        evt.preventDefault()
        //забрали значення інпута console.log(searchText)
      const searchText = evt.currentTarget.elements.searchQuery.value.trim()
        inputValue = searchText
        
      getImages(searchText, currentPage)


    //ПОМИЛКА!!!!! В ЗЕН
   //getImages().then(data => console.dir(data)).catch(console.error('error'))

}


//функція запиту на бек зен кетч залишаються, бо треба малювати після лода
function getImages(text, page) {
    axios.get(`${URL}?${seachParams}&q=${text}&page=${page}`)
        .then(function (response) {
            //отримали мисив картинок
//            const imagesArr = response.data.hits
//            console.log(imagesArr)
            gallery.insertAdjacentHTML('beforeend', createMarkup(response.data.hits))
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })

}


//функція створення розмітки ПРАЦЮЄ
function createMarkup(arr) {
     const markup = arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
    </p>
    <p class="info-item">
      <b>Views</b>
    </p>
    <p class="info-item">
      <b>Comments</b>
    </p>
    <p class="info-item">
      <b>Downloads</b>
    </p>
  </div>
</div>`).join('')
    console.log(markup)
    return markup
}


loader.addEventListener('click', forLoadMore)

//для отримання наступної групи картинок
function forLoadMore(evt) {
    currentPage += 1;
   getImages(inputValue, currentPage)
}







//______________________________________________________
//  СМІТТЯ
//function getImages() {
//    return fetch(`${URL}?${seachParams}&q=cat`)
//    .then(response => {
 //       if (!response.ok) {
//            console.log(response)
//            throw new Error(response.status);
//        }
//        return response.json();
//    })
//}