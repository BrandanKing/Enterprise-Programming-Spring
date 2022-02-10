import { Modal } from 'bootstrap';
import axios from 'axios';

import { requestHeaders, validateForm, generateFilmsArray, generateXMLfromObj, objToString, generateFilmObj } from './utils/appUtils';
import { injectError, injectSuccess } from './utils/globalUtils';

const app = Vue.createApp({
	data() {
		return {
			films: [],
			film: {
				id: 0,
				title: '',
				year: 2022,
				director: '',
				stars: '',
				review: '',
			},
			dataType: 'json',
			modal: null,
			loading: false,
			updateAddMethod: 'POST',
			search: {
				by: 'filmTitle',
				text: '',
			},
			pagination: {
				currentPage: 0,
				filmsPerPage: 9,
				totalPages: 0,
			},
		};
	},
	created() {
		this.getFilms();
	},
	computed: {
		indexStart() {
			return this.pagination.currentPage * this.pagination.filmsPerPage;
		},
		indexEnd() {
			return this.indexStart + this.pagination.filmsPerPage;
		},
		paginated() {
			return this.films.slice(this.indexStart, this.indexEnd);
		},
	},
	methods: {
		async getFilm(filmID) {
			this.loading = true;
			const config = {
				method: 'GET',
				headers: requestHeaders[this.dataType],
				params: {
					filmID: filmID,
				},
			};
			await axios('/api/film', config)
				.then((response) => {
					this.films = [];
					this.films.push(generateFilmObj(this.dataType, response.data));
					this.totalPages();
				})
				.catch((error) => {
					injectError(error);
				});
			this.loading = false;
		},
		async getFilms(filmTitle = null) {
			this.loading = true;
			let config = {
				method: 'GET',
				headers: requestHeaders[this.dataType],
			};
			if (filmTitle) {
				config.params = {
					filmTitle: filmTitle,
				};
			}
			await axios('/api/films', config)
				.then((response) => {
					this.films = generateFilmsArray(this.dataType, response.data);
					this.totalPages();
				})
				.catch((error) => {
					injectError(error);
				});
			this.loading = false;
		},
		async addUpdateFilm() {
			let filmData = '';
			switch (this.dataType) {
				case 'json':
					filmData = JSON.stringify(this.film);
					break;
				case 'xml':
					filmData = generateXMLfromObj('Film', this.film);
					break;
				case 'text':
					filmData = objToString(this.film);
					break;
				default:
					throw new Error('Error');
			}
			const config = {
				method: this.updateAddMethod,
				headers: requestHeaders[this.dataType],
				data: filmData,
			};
			await axios('/api/update', config)
				.then((response) => {
					this.clear(false);
					if (this.addUpdateFilm == 'POST') {
						injectSuccess(`Film added`);
					} else {
						injectSuccess(`Film Updated`);
					}
				})
				.catch((error) => {
					injectError(error);
				});
		},
		async deleteFilm(filmID) {
			const config = {
				method: 'DELETE',
				params: {
					filmID: filmID,
				},
			};
			await axios('/api/delete', config)
				.then((response) => {
					this.clear(true);
					injectSuccess(response.data);
				})
				.catch((error) => {
					console.log(error);
				});
		},
		async searchFilms(form) {
			if (validateForm(form)) {
				this.search.by == 'filmTitle' ? await this.getFilms(this.search.text) : await this.getFilm(this.search.text);
				this.pagination.currentPage = 0;
				this.modal.hide();
			}
		},
		editFilm(film) {
			this.updateAddMethod = 'PUT';
			this.film = film;
			this.showModal('addFilmModal');
		},
		showModal(modalID) {
			this.modal = new Modal(document.getElementById(modalID));
			this.modal.show();
		},
		submitFilm(form) {
			if (validateForm(form)) {
				this.addUpdateFilm();
				this.modal.hide();
				this.clearFilm();
			}
		},
		clear(clearPagination) {
			this.clearFilm();
			this.films = [];

			if (clearPagination) {
				this.pagination = {
					currentPage: 0,
					filmsPerPage: 9,
					totalFilms: 0,
				};
			}
			this.refresh();
		},
		clearFilm() {
			this.film = {
				id: 0,
				title: '',
				year: 2022,
				director: '',
				stars: '',
				review: '',
			};
		},
		refresh() {
			this.getFilms();
		},
		prev() {
			this.pagination.currentPage--;
		},
		next() {
			this.pagination.currentPage++;
		},
		totalPages() {
			this.pagination.totalPages = Math.ceil(this.films.length / this.pagination.filmsPerPage) - 1;
		},
	},
});

app.mount('#app');
