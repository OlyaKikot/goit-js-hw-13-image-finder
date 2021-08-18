import './sass/main.scss';
import NewService from './apiService.js';
import createImagesMarkup from '../src/templates/example.hbs';
import { alert } from '../node_modules/@pnotify/core/dist/PNotify.js';
// import * as PNotifyMobile from '../node_modules/@pnotify/mobile/dist/PNotifyMobile.js';
import '@pnotify/core/dist/BrightTheme.css';
var _ = require('lodash');
const refs = {
  body: document.body,
  input: document.querySelector('.input'),
  listImages: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('.button'),
  buttonTop: document.querySelector('.button-top'),
  overlay: document.querySelector('.lightbox'),
  imgOriginal: document.querySelector('.lightbox__image'),
  buttonClose: document.querySelector('button[data-action="close-lightbox"]'),
};

const newService = new NewService();
refs.listImages.addEventListener('click', onImageClick);
refs.input.addEventListener('input', _.debounce(createImages, 700));
refs.loadMoreButton.addEventListener('click', onLoadMore);
refs.buttonTop.addEventListener('click', onTop);
refs.overlay.addEventListener('click', onCloseOverly);
refs.buttonClose.addEventListener('click', onBtnCloseModal);
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
  refs.body.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}

async function onLoadMore() {
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

  const currentEl = [...refs.gallery.children].find(
    liEl => liEl.firstElementChild.href === refs.imgOriginal.src
  );

  if (event.code === 'ArrowRight') {
    if (!currentEl.nextSibling) {
      refs.imgOriginal.src =
        refs.gallery.firstElementChild.firstElementChild.href;
    } else refs.imgOriginal.src = currentEl.nextSibling.firstElementChild.href;
  }

  if (event.code === 'ArrowLeft') {
    if (!currentEl.previousSibling) {
      refs.imgOriginal.src =
        refs.gallery.lastElementChild.firstElementChild.href;
    } else
      refs.imgOriginal.src = currentEl.previousSibling.firstElementChild.href;
  }
}
