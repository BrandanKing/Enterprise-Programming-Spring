package controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;

import model.Film;
import model.Films;
import service.FilmServiceDAO;

@Controller
@RequestMapping
public class FilmHttp {
	@Autowired
	private FilmServiceDAO dao;

	@GetMapping(value = "rest")
	public String rest(Model model) {
		model.addAttribute("title", "Search Films - REST Requests");
		return "pages/api/index";
	}

	@GetMapping(value = "/")
	public String getAllFilms(Model model, @RequestParam(defaultValue = "1") int page) {
		Pageable paging = PageRequest.of((page - 1), 9);
		Page<Film> pageDetails = dao.getAllFilms(paging);
		List<Film> films = pageDetails.getContent();

		model.addAttribute("title", "Search Films - HTTP Requests");
		model.addAttribute("films", films);
		model.addAttribute("currentPage", page);
		model.addAttribute("totalPages", pageDetails.getTotalPages());
		return "pages/http/index";
	}

	@GetMapping(value = "/", params = "filmID")
	public String searchByID(@RequestParam long filmID, Model model) {
		Optional<Film> film = dao.getFilmByID(filmID);
		if (film.isPresent()) {
			List<Film> films = new ArrayList<>();
			model.addAttribute("title", "Search Films - HTTP Requests");
			films.add(film.get());
			model.addAttribute("films", films);
			return "pages/http/index";
		} else {
			return "pages/http/404";
		}
	}

	@GetMapping(value = "/", params = "filmTitle")
	public String searchByTitle(@RequestParam String filmTitle, Model model) {
		Films filmsList = dao.getFilmsByTitle(filmTitle);
		List<Film> films = filmsList.getFilms();
		model.addAttribute("films", films);
		model.addAttribute("title", "Search Films - HTTP Requests");
		return !films.isEmpty() ? "pages/http/index" : "pages/http/404";
	}

	@PostMapping(value = "/add")
	public RedirectView addFilm(Film film, RedirectAttributes redirectAttrs) {
		film = dao.addNewFilm(film);
		redirectAttrs.addFlashAttribute("alert", "Success!");
		return new RedirectView("/", true);
	}

	@PostMapping(value = "/delete")
	public RedirectView delete(@RequestParam long filmID, RedirectAttributes redirectAttrs) {
		boolean filmDeleted = dao.deleteFilmById(filmID);

		if (filmDeleted)
			redirectAttrs.addFlashAttribute("alert", "Film successfully deleted");

		return new RedirectView("/", true);
	}

}
