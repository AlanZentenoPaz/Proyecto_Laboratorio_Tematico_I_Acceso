package mx.uam.cua.proyecto.repository;

import mx.uam.cua.proyecto.entity.Salida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SalidaRepository extends JpaRepository<Salida, Integer> {
    List<Salida> findByAlumnoIdAlumno(Integer idAlumno);
    List<Salida> findByPuntoAccesoIdPuntoAcceso(Integer idPuntoAcceso);
    List<Salida> findByFechaHoraBetween(LocalDateTime inicio, LocalDateTime fin);
    List<Salida> findByResultado(Salida.Resultado resultado);

    @Query("SELECT s FROM Salida s WHERE s.alumno.idAlumno = :idAlumno ORDER BY s.fechaHora DESC")
    List<Salida> findUltimasSalidasByAlumno(@Param("idAlumno") Integer idAlumno);
}