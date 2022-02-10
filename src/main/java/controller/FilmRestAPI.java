package controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import model.Film;
import model.Films;
import service.FilmServiceDAO;

@RestController
@CrossOrigin
@RequestMapping(value = "/api")
public class FilmRestAPI {

	@Autowired
	private FilmServiceDAO dao;

	/*
	 * 
	 * GET FILMS
	 * 
	 */

	@GetMapping(value = "/films", produces = {MediaType.TEXT_PLAIN_VALUE})
	public String getAllFilmsText(@RequestParam(name = "page", defaultValue = "1") int page) {
		Films films = dao.getAllFilms();
		return films.toString();
	}

	@GetMapping(value = "/films", produces = {MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
	public Films getAllFilms(@RequestParam(name = "page", defaultValue = "1") int page) {
		return dao.getAllFilms();
	}

	/*
	 * 
	 * GET FILM BY ID
	 * 
	 */

	@GetMapping(value = "/film", produces = {MediaType.TEXT_PLAIN_VALUE}, params = "filmID")
	public ResponseEntity<String> searchByIDText(@RequestParam long filmID) {
		Optional<Film> film = dao.getFilmByID(filmID);

		if (film.isPresent()) {
			return ResponseEntity.status(HttpStatus.OK).body(film.get().toText());
		}

		return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	}

	@GetMapping(value = "/film", produces = {MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_JSON_VALUE}, params = "filmID")
	public ResponseEntity<Film> getFilm(@RequestParam long filmID) {
		Optional<Film> film = dao.getFilmByID(filmID);

		if (film.isPresent()) {
			return ResponseEntity.status(HttpStatus.OK).body(film.get());
		}

		return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	}

	/*
	 * 
	 * GET FILM BY TITLE
	 * 
	 */

	@GetMapping(value = "/films", produces = {MediaType.TEXT_PLAIN_VALUE}, params = "filmTitle")
	public ResponseEntity<String> searchByIDText(@RequestParam String filmTitle) {
		Films films = dao.getFilmsByTitle(filmTitle);
		if (!films.getFilms().isEmpty()) {
			return ResponseEntity.status(HttpStatus.OK).body(films.toString());
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	}

	@GetMapping(value = "/films", produces = {MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_JSON_VALUE}, params = "filmTitle")
	public ResponseEntity<Films> getFilm(@RequestParam String filmTitle) {
		Films films = dao.getFilmsByTitle(filmTitle);
		if (!films.getFilms().isEmpty()) {
			return ResponseEntity.status(HttpStatus.OK).body(films);
		}
		return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
	}

	/*
	 * 
	 * UPDATE FILM
	 * 
	 */

	@RequestMapping(method = {RequestMethod.POST, RequestMethod.PUT}, value = "/update", consumes = {
			MediaType.TEXT_PLAIN_VALUE}, produces = {MediaType.TEXT_PLAIN_VALUE})
	public ResponseEntity<String> updateFilm(@RequestBody String filmString) {

		String[] filmEle = filmString.split("&#44;");
		Film film = new Film();

		film.setId(Long.parseLong(filmEle[0]));
		film.setTitle(filmEle[1]);
		film.setYear(Integer.parseInt(filmEle[2]));
		film.setDirector(filmEle[3]);
		film.setStars(filmEle[4]);
		film.setReview(filmEle[5]);
		film = dao.addNewFilm(film);

		return ResponseEntity.status(HttpStatus.OK).body(film.toText());
	}

	@RequestMapping(method = {RequestMethod.POST, RequestMethod.PUT}, value = "/update", consumes = {MediaType.APPLICATION_XML_VALUE,
			MediaType.APPLICATION_JSON_VALUE}, produces = {MediaType.APPLICATION_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
	public ResponseEntity<Film> updateFilm(@RequestBody Film film) {
		film = dao.addNewFilm(film);
		return ResponseEntity.status(HttpStatus.OK).body(film);
	}

	/*
	 * 
	 * DELETE FILM
	 * 
	 */

	@DeleteMapping(value = "/delete")
	public ResponseEntity<String> deleteFilm(@RequestParam int filmID) {
		boolean filmDeleted = dao.deleteFilmById(filmID);

		if (filmDeleted) return ResponseEntity.status(HttpStatus.OK).body("Film Deleted");

		return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Film failed to delete");
		
	}

}
