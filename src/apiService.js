export default function fetchImages(searchQuery) {
  return fetch(
    `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${searchQuery}&page=1&per_page=12&key=22945587-13dcce98a35cac559e6949163`
  ).then(response => {
    return response.json();
  });
}
