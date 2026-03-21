package mx.uam.cua.proyecto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AccesoRepository extends JpaRepository<Acceso, Integer> {
    List<Acceso> findByAlumnoIdAlumno(Integer idAlumno);
    List<Acceso> findByPuntoAccesoIdPuntoAcceso(Integer idPuntoAcceso);
    List<Acceso> findByFechaHoraBetween(LocalDateTime inicio, LocalDateTime fin);
    List<Acceso> findByResultado(Acceso.Resultado resultado);

    @Query("SELECT a FROM Acceso a WHERE a.alumno.idAlumno = :idAlumno ORDER BY a.fechaHora DESC")
    List<Acceso> findUltimosAccesosByAlumno(@Param("idAlumno") Integer idAlumno);
}