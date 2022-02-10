import { XMLParser, XMLBuilder } from 'fast-xml-parser';
export function stringToFilm(string) {
	const filmElements = string.split('&#44;');
	const film = {
		id: filmElements[0],
		title: filmElements[1],
		year: filmElements[2],
		director: filmElements[3],
		stars: filmElements[4],
		review: filmElements[5],
	};
	return film;
}

export function stringToFilms(string) {
	const filmsString = string.split(/\r?\n/);
	let films = [];
	filmsString.forEach((row) => {
		const film = stringToFilm(row);
		films.push(film);
	});
	return films;
}

export function validateForm(form) {
	form.target.classList.add('was-validated');
	if (!form.target.checkValidity()) {
		form.preventDefault();
		form.stopPropagation();
		return false;
	}
	return true;
}

export const requestHeaders = {
	json: {
		Accept: 'application/json',
		'content-type': 'application/json',
	},
	text: {
		Accept: 'text/plain',
		'content-type': 'text/plain',
	},
	xml: {
		Accept: 'application/xml',
		'content-type': 'application/xml',
	},
};

export function generateObjfromXML(xml) {
	const options = {
		ignoreAttributes: true,
	};

	const parser = new XMLParser(options);

	return parser.parse(xml);
}

export function generateXMLfromObj(name, obj) {
	const options = {
		ignoreAttributes: true,
	};

	const builder = new XMLBuilder(options);
	return builder.build({ [name]: obj });
}

export function objToString(obj) {
	return Object.keys(obj)
		.map((key) => `${obj[key]}`)
		.join('&#44;');
}

export function generateFilmObj(dataType, data) {
	switch (dataType) {
		case 'json':
			return data;
		case 'xml':
			const xmlData = generateObjfromXML(data);
			return xmlData.Film;
		case 'text':
			return stringToFilm(data);
		default:
			throw new Error('Error');
	}
}

export function generateFilmsArray(dataType, data) {
	switch (dataType) {
		case 'json':
			return data.films;
		case 'xml':
			let xmlData = generateObjfromXML(data).Films;
			if (Array.isArray(xmlData.Film)) xmlData = xmlData.Film;
			return xmlData;
		case 'text':
			return stringToFilms(data);
		default:
			throw new Error('Error');
	}
}
