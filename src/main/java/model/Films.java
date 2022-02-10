package model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

public class Films {

	@JacksonXmlProperty(localName = "Film")
	@JacksonXmlElementWrapper(useWrapping = false)
	private List<Film> films = new ArrayList<>();

	public List<Film> getFilms() {
		return films;
	}

	public Films(List<Film> films) {
		this.films = films;
	}

	@Override
	public String toString() {

		final StringBuilder builder = new StringBuilder();
		films.forEach((Film film) -> {
			builder.append(film.toText() + "\n");
		});

		String concatenatedString = builder.toString();

		return concatenatedString.substring(0, concatenatedString.length() - 1);
	}

}
