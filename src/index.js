import fetchImages from './apiService.js';
import createImagesMarkup from '../src/templates/example.hbs';
var _ = require('lodash');
const refs = {
  input: document.querySelector('.input'),
  listImages: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('.button'),
};
let nameImages = '';
refs.input.addEventListener('keydown', _.debounce(createImages, 500));
function createImages(searchQuery) {
  nameImages = searchQuery.target.value;

  fetchImages(nameImages).then(renderMarkup).catch(onError);
}

function onError(error) {
  console.log(error);
}

function renderMarkup(carts) {
  let imagesHTML = '';

  imagesHTML = carts.hits.map(cart => createImagesMarkup(cart));
  refs.listImages.insertAdjacentHTML('beforeend', imagesHTML);
}
refs.loadMoreButton.addEventListener('click', onLoadMore);

function onLoadMore() {
  fetchImages(nameImages).then(renderMarkup).catch(onError);
}
refs.loadMoreButton.scrollIntoView({
  behavior: 'smooth',
  block: 'end',
});
