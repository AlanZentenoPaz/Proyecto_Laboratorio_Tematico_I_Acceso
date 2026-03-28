package mx.uam.cua.proyecto.repository;

import mx.uam.cua.proyecto.entity.ReporteTecnico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ReporteTecnicoRepository extends JpaRepository<ReporteTecnico, Integer> {

    List<ReporteTecnico> findByFecha(LocalDate fecha);

    List<ReporteTecnico> findByFechaBetween(LocalDate fechaInicio, LocalDate fechaFin);

    List<ReporteTecnico> findByNumeroTorniquete(Integer numeroTorniquete);

    List<ReporteTecnico> findByReporta(ReporteTecnico.TipoReporta reporta);

    List<ReporteTecnico> findByDescripcionContaining(String keyword);

    @Query("SELECT r FROM ReporteTecnico r WHERE r.fecha = :fecha AND r.numeroTorniquete = :numero")
    List<ReporteTecnico> findByFechaAndNumeroTorniquete(@Param("fecha") LocalDate fecha,
                                                        @Param("numero") Integer numero);

    @Query("SELECT r FROM ReporteTecnico r WHERE r.fecha = :fecha AND r.hora BETWEEN :horaInicio AND :horaFin")
    List<ReporteTecnico> findByFechaAndHoraBetween(@Param("fecha") LocalDate fecha,
                                                   @Param("horaInicio") LocalTime horaInicio,
                                                   @Param("horaFin") LocalTime horaFin);
}