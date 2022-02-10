package repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import model.Film;

@Repository
public interface FilmRepository extends JpaRepository<Film, Long> {
	List<Film> findByTitleContaining(String title);
	Page<Film> findAll(Pageable pageable);
}
