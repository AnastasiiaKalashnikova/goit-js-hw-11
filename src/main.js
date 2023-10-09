import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const URL = 'https://pixabay.com/api/'
const API_KEY = '39890797-00190d6beecffd2ffd1001b1e'
const seachParams = new URLSearchParams({
    key:API_KEY,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: 40
})
let currentPage;
let inputValue = ''

const form = document.querySelector('.js-form')
const gallery = document.querySelector('.js-gallery')
const loader = document.querySelector('.js-load-btn')




form.addEventListener('submit', forSearch)


function forSearch(evt) {
  clearGallery();
  loader.hidden = true;
    currentPage = 1;
    evt.preventDefault();
    //забрали значення інпута console.log(searchText)
    const searchText = evt.currentTarget.elements.searchQuery.value.trim()
    inputValue = searchText
    //якщо поле порожнє
    if (!searchText) {
        Notiflix.Notify.failure('Please fiil the field.')
        return
    }   
    getImages(searchText, currentPage)
    evt.currentTarget.reset()
}


async function getImages(text, page = 1) {
  try {const response = await axios.get(`${URL}?${seachParams}&q=${text}&page=${page}`)
    if (response.status !== 200) {
        throw new Error(response)
    }
    //якщо картинок немає
    if (response.data.totalHits === 0) {
        loader.hidden = true
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
        return
    }

    gallery.insertAdjacentHTML('beforeend', createMarkup(response.data.hits))
    Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`)   
    loader.hidden = false;
    let lightbox = new SimpleLightbox('.gallery a');
         if ((response.data.totalHits / 40) < 1) {
        loader.hidden = true
        return
    } 
  }
  catch (error) {
    Notiflix.Notify.failure('Something went wrong. Please try again.')
          console.log(error.message)
            return;
  }
}


//функція створення розмітки ПРАЦЮЄ
function createMarkup(arr) {
    const markup = arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
     `<div class="photo-card">
     <a class="gallery__link" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" class="img"/>
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b> <br> ${likes}
    </p>
    <p class="info-item">
      <b>Views</b> <br> ${views}
    </p>
    <p class="info-item">
      <b>Comments</b> <br> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> <br> ${downloads}
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
    getNextImages(inputValue, currentPage)
}

async function getNextImages(text, page) {
  try {
    const response = await axios.get(`${URL}?${seachParams}&q=${text}&page=${page}`)
    if (response.status !== 200) {
      throw new Error(response)
    }
    gallery.insertAdjacentHTML('beforeend', createMarkup(response.data.hits));
            if (currentPage > Math.floor(response.data.totalHits / 40)) {
                loader.hidden = true
                Notiflix.Notify.info('We are sorry but you have reached the end of search results.')
                return
            }

  } catch (error) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')
    console.log(error).message;
  }
}


//очистити для нового запиту
function clearGallery() {
    gallery.innerHTML =""
}



