package mx.uam.cua.proyecto.service;

import mx.uam.cua.proyecto.dto.AccesoDTO;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AccesoService {
    AccesoDTO create(AccesoDTO accesoDTO);
    Optional<AccesoDTO> findById(Integer id);
    List<AccesoDTO> findAll();
    AccesoDTO update(Integer id, AccesoDTO accesoDTO);
    void delete(Integer id);
    List<AccesoDTO> findByAlumnoId(Integer idAlumno);
    List<AccesoDTO> findByPuntoAccesoId(Integer idPuntoAcceso);
    List<AccesoDTO> findByFechaBetween(LocalDateTime inicio, LocalDateTime fin);
    List<AccesoDTO> findUltimosAccesosByAlumno(Integer idAlumno);
}