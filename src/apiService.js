export default function fetchImages(searchQuery, page = 1) {
  return fetch(
    `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${searchQuery}&page=${page}&per_page=12&key=22945587-13dcce98a35cac559e6949163`
  ).then(response => {
    return response.json();
  });
}
