import 'bootstrap';
import { toggleSearchType } from './utils/globalUtils';

// Import film data from film into modal to be used to update film. This will leave all data blank when clicking add new film
function modalFormPopulation() {
	var filmModal = document.getElementById('filmModal');
	filmModal.addEventListener('show.bs.modal', function (event) {
		const button = event.relatedTarget;
		const filmID = button.getAttribute('data-bs-filmID');
		const filmTitle = button.getAttribute('data-bs-title');
		const filmYear = button.getAttribute('data-bs-year');
		const filmDirector = button.getAttribute('data-bs-director');
		const filmCast = button.getAttribute('data-bs-stars');
		const filmReview = button.getAttribute('data-bs-review');

		const modalTitle = filmModal.querySelector('.modal-title');
		const formFilmID = filmModal.querySelector('.modal-body #film-id');
		const formFilmTitle = filmModal.querySelector('.modal-body #film-title');
		const formFilmYear = filmModal.querySelector('.modal-body #film-year');
		const formFilmDirector = filmModal.querySelector('.modal-body #film-director');
		const formFilmCast = filmModal.querySelector('.modal-body #film-stars');
		const formFilmReview = filmModal.querySelector('.modal-body #film-review');
console.log(filmYear);
		modalTitle.textContent = button.getAttribute('data-bs-type');
		formFilmID.value = filmID ? filmID : 0;
		formFilmTitle.value = filmTitle;
		formFilmYear.value = filmYear ? filmYear : 2022;
		formFilmDirector.value = filmDirector;
		formFilmCast.value = filmCast;
		formFilmReview.value = filmReview;
	});
}

window.addEventListener('load', function () {
	toggleSearchType();
	modalFormPopulation();
});
