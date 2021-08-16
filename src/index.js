import fetchImages from './apiService.js';
import createImagesMarkup from '../src/templates/example.hbs';
var _ = require('lodash');
const refs = {
  input: document.querySelector('.input'),
  listImages: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('.button'),
};
let searchQuery = '';
let page = 1;
refs.input.addEventListener('input', _.debounce(createImages, 500));
refs.loadMoreButton.addEventListener('click', onLoadMore);

function createImages() {
  searchQuery = refs.input.value;
  page = 1;
  fetchImages(searchQuery).then(renderMarkup).catch(onError);
}

function onError(error) {
  console.log(error);
}

function renderMarkup(data) {
  let imagesHTML = '';
  imagesHTML = data.hits.map(cart => createImagesMarkup(cart)).join('');
  refs.listImages.insertAdjacentHTML('beforeend', imagesHTML);
}

function onLoadMore() {
  page += 1;
  fetchImages(searchQuery, page).then(renderMarkup).catch(onError);
}

refs.loadMoreButton.scrollIntoView({
  behavior: 'smooth',
  block: 'end',
});
