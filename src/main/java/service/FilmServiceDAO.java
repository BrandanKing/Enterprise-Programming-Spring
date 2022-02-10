package service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import model.Film;
import model.Films;
import repository.FilmRepository;
@Service
public class FilmServiceDAO {

	@Autowired
	private FilmRepository filmRepository;

	FilmServiceDAO() {
		super();
	}

	public Films getAllFilms() {

		List<Film> films = filmRepository.findAll();
		Films allFilms = new Films(films);
		return allFilms;
	}

	public Films getFilmsByTitle(String title) {

		List<Film> films = filmRepository.findByTitleContaining(title);
		Films allFilms = new Films(films);
		return allFilms;
	}

	public Page<Film> getAllFilms(Pageable pageable) {
		return filmRepository.findAll(pageable);
	}

	public Optional<Film> getFilmByID(long id) {
		return filmRepository.findById(id);
	}

	public Film addNewFilm(Film film) {
		return filmRepository.save(film);
	}

	public boolean deleteFilmById(long id) {
		Optional<Film> film = getFilmByID(id);

		if (!film.isPresent())
			return false;

		filmRepository.deleteById(id);
		return true;

	}

}
