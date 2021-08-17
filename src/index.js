import './sass/main.scss';
import NewService from './apiService.js';
import createImagesMarkup from '../src/templates/example.hbs';
import { alert } from '../node_modules/@pnotify/core/dist/PNotify.js';
// import * as PNotifyMobile from '../node_modules/@pnotify/mobile/dist/PNotifyMobile.js';
import '@pnotify/core/dist/BrightTheme.css';
var _ = require('lodash');
const refs = {
  input: document.querySelector('.input'),
  listImages: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('.button'),
  buttonTop: document.querySelector('.button-top'),
};

const newService = new NewService();

refs.input.addEventListener('input', _.debounce(createImages, 700));
refs.loadMoreButton.addEventListener('click', onLoadMore);
refs.buttonTop.addEventListener('click', onTop);

function createImages() {
  clearContainer();
  newService
    .fetchImages(refs.input.value)
    .then(data => {
      if (data.hits.length !== 0) renderMarkup(data);
      else onError();
    })
    .catch(onError);
  newService.resetPage();
}

function onError(error) {
  console.log('ok');
  // defaultModules.set(PNotifyMobile, {});

  alert({
    text: 'Пожалуйста, уточните критерии поиска',
    type: 'error',
    hide: true,
    delay: 3000,
  });

  console.log(error);
}

function renderMarkup(data) {
  let imagesHTML = '';
  imagesHTML = data.hits.map(cart => createImagesMarkup(cart)).join('');
  refs.listImages.insertAdjacentHTML('beforeend', imagesHTML);
}

function onTop() {
  refs.listImages.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}

function onLoadMore() {
  newService
    .fetchImages(refs.input.value)
    .then(renderMarkup)
    .catch(onError)
    .finally(() => {
      refs.listImages.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    });
}

function clearContainer() {
  refs.listImages.innerHTML = '';
}
