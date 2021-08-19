import './sass/main.scss';
import NewService from './apiService.js';
import createImagesMarkup from '../src/templates/example.hbs';
import { alert } from '../node_modules/@pnotify/core/dist/PNotify.js';

import '@pnotify/core/dist/BrightTheme.css';

const refs = {
  body: document.body,
  input: document.querySelector('.input'),
  listImages: document.querySelector('.gallery'),
  overlay: document.querySelector('.lightbox'),
  imgOriginal: document.querySelector('.lightbox__image'),
  buttonClose: document.querySelector('button[data-action="close-lightbox"]'),
  sentinel: document.querySelector('.sentinel'),
  searchForm: document.querySelector('.search-form'),
};

const newService = new NewService();
refs.listImages.addEventListener('click', onImageClick);
refs.overlay.addEventListener('click', onCloseOverly);
refs.buttonClose.addEventListener('click', onBtnCloseModal);
refs.searchForm.addEventListener('submit', onSearch);
window.addEventListener('keydown', onkeydown);

function onBtnCloseModal() {
  refs.overlay.classList.remove('is-open');
  refs.imgOriginal.src = '';
}

function onCloseOverly(event) {
  if (!event.target.classList.contains('lightbox__overlay')) {
    return;
  }
  refs.overlay.classList.remove('is-open');
}

function createImages(searchRequest) {
  clearContainer();
  newService.resetPage();
  newService
    .fetchImages(searchRequest)
    .then(data => {
      if (data.hits.length !== 0) renderMarkup(data);
      else onError();
    })
    .catch(onError);
}

function onSearch(event) {
  event.preventDefault();
  const searchRequest = refs.input.value.trim();
  console.log(searchRequest);
  if (searchRequest !== '') createImages(searchRequest);
}

function onError(error) {
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

const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && newService.page > 1) {
      console.log('entries:');
      newService.fetchImages().then(renderMarkup).catch(onError);
    }
  });
};

const option = {
  rootMargin: '150px',
};

const observer = new IntersectionObserver(onEntry, option);
observer.observe(refs.sentinel);

function clearContainer() {
  refs.listImages.innerHTML = '';
}

function onImageClick(evt) {
  evt.preventDefault();
  const isGalleryImagesEl = evt.target.classList.contains('gallery__image');

  if (!isGalleryImagesEl) {
    return;
  } else {
    refs.overlay.classList.add('is-open');

    refs.imgOriginal.src = evt.target.dataset.source;
  }
}

function onkeydown(event) {
  if (!refs.overlay.classList.contains('is-open')) return;

  if (event.code === 'Escape') {
    refs.overlay.classList.remove('is-open');
  }
}
