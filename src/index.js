import axios from 'axios';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.7.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

axios.defaults.headers.common['x-api-key'] = '44209717-4a56fa844a5258582c59ce6a4';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more-button');
let page = 1;
let dataStore = [];
let search;
let currentNumber = 40;
const lightbox = new SimpleLightbox('.photo-card a');

const fetchFunc = async function() {
  try {
    const response = await fetch(`https://pixabay.com/api/?key=44209717-4a56fa844a5258582c59ce6a4&q=${search}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
    dataStore = await response.json();
    const mappedData = dataStore.hits.map(i => `
      <div class='photo-card'>
        <a href='${i.largeImageURL}'><img class='search-img' src='${i.webformatURL}' alt='${i.tags}' loading='lazy' /></a>
        <div class='info'>
          <div class='info-item'>
            <b>Likes</b>
            <div>${i.likes}</div>
          </div>
          <div class='info-item'>
            <b>Views</b>
            <div>${i.views}</div>
          </div>
          <div class='info-item'>
            <b>Comments</b>
            <div>${i.comments}</div>
          </div>
          <div class='info-item'>
            <b>Downloads</b>
            <div>${i.downloads}</div>
          </div>
        </div>
      </div>
    `).join('');
    gallery.insertAdjacentHTML('beforeend', mappedData);
    lightbox.refresh();

    if (page === 1) {
      if (dataStore.hits.length === 0) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      } else if (currentNumber > dataStore.totalHits) {
        Notiflix.Notify.success(`We're sorry, but you've reached the end of search results.`);
        loadMore.style.display = 'none';
      } else {
        Notiflix.Notify.success(`Hooray! We found ${dataStore.totalHits} images.`);
        loadMore.style.display = 'inline-block';
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    Notiflix.Notify.failure('Failed to fetch data');
  }
};

searchForm.addEventListener('submit',  (event) => {
  event.preventDefault();
  page = 1;
  currentNumber = 40;
  search = event.currentTarget.elements.searchQuery.value;
  while (gallery.firstChild) {
    gallery.removeChild(gallery.firstChild);
  }
  loadMore.style.display = 'none';
   fetchFunc();
});

loadMore.addEventListener('click', async () => {
  page++;
  currentNumber += 40
  await fetchFunc();

  if (gallery && gallery.firstElementChild) {
    const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });
  } else {
    console.error('Element with class "gallery" or its first child not found');
  }

  if (currentNumber >= dataStore.totalHits) {
    Notiflix.Notify.success(`We're sorry, but you've reached the end of search results.`);
    loadMore.style.display = 'none';
  }
});

