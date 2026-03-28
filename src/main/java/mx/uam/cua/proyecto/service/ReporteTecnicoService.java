package mx.uam.cua.proyecto.service;

import mx.uam.cua.proyecto.dto.ReporteTecnicoDTO;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface ReporteTecnicoService {

    ReporteTecnicoDTO create(ReporteTecnicoDTO reporteDTO);

    Optional<ReporteTecnicoDTO> findById(Integer id);

    List<ReporteTecnicoDTO> findAll();

    ReporteTecnicoDTO update(Integer id, ReporteTecnicoDTO reporteDTO);

    void delete(Integer id);

    List<ReporteTecnicoDTO> findByFecha(LocalDate fecha);

    List<ReporteTecnicoDTO> findByFechaBetween(LocalDate fechaInicio, LocalDate fechaFin);

    List<ReporteTecnicoDTO> findByNumeroTorniquete(Integer numeroTorniquete);

    List<ReporteTecnicoDTO> findByReporta(String reporta);

    List<ReporteTecnicoDTO> searchByDescripcion(String keyword);

    List<ReporteTecnicoDTO> findByFechaAndNumeroTorniquete(LocalDate fecha, Integer numero);

    List<ReporteTecnicoDTO> findByFechaAndHoraBetween(LocalDate fecha, LocalTime horaInicio, LocalTime horaFin);
}