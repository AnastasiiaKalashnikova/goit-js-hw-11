import axios from "axios";
import Notiflix from 'notiflix';

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
    //якщо поле порожнє
    if (!searchText) {
        Notiflix.Notify.failure('Please fiil the field.')
        return
    }   
    

    getImages(searchText, currentPage)
        .then(function (response) {
            if (response.data.totalHits === 0) {
                //якщо картинок немає
                Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
                return
            }

        gallery.insertAdjacentHTML('beforeend', createMarkup(response.data.hits))
        Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`)   
        loader.hidden = false    
                 if ((response.data.totalHits / 40) < 1) {
                loader.hidden = true
                return
            } 
            
  })
        .catch(function (error) {
      Notiflix.Notify.failure('Something went wrong. Please try again.')
    console.log(error);
        })
    .finally(evt.currentTarget.reset())
}


async function getImages(text, page) {
    const response = await axios.get(`${URL}?${seachParams}&q=${text}&page=${page}`)
return response
}


//функція створення розмітки ПРАЦЮЄ
function createMarkup(arr) {
     const markup = arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" class="img"/>
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
    //console.log(markup)
    return markup
}


loader.addEventListener('click', forLoadMore)

//для отримання наступної групи картинок
function forLoadMore(evt) {
    currentPage += 1;
    getImages(inputValue, currentPage)
        .then(function (response) {
            gallery.insertAdjacentHTML('beforeend', createMarkup(response.data.hits))
            if (currentPage > Math.floor(response.data.totalHits / 40)) {
                loader.hidden = true
                Notiflix.Notify.info('We are sorry but you have reached the end of search results.')
                return
            }
  })
        .catch(function (error) {
    console.log(error);
  })
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