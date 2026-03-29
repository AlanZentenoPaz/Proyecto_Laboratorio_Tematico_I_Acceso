package mx.uam.cua.proyecto.service;

import mx.uam.cua.proyecto.dto.SalidaDTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SalidaService {
    SalidaDTO create(SalidaDTO salidaDTO);
    Optional<SalidaDTO> findById(Integer id);
    List<SalidaDTO> findAll();
    SalidaDTO update(Integer id, SalidaDTO salidaDTO);
    void delete(Integer id);
    List<SalidaDTO> findByAlumnoId(Integer idAlumno);
    List<SalidaDTO> findByPuntoAccesoId(Integer idPuntoAcceso);
    List<SalidaDTO> findByFechaBetween(LocalDateTime inicio, LocalDateTime fin);
    List<SalidaDTO> findUltimasSalidasByAlumno(Integer idAlumno);
}