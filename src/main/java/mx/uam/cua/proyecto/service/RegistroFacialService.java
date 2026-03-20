package mx.uam.cua.proyecto.service;

import mx.uam.cua.proyecto.dto.RegistroFacialDTO;
import java.util.List;
import java.util.Optional;

public interface RegistroFacialService {
    RegistroFacialDTO create(RegistroFacialDTO registroFacialDTO);
    Optional<RegistroFacialDTO> findById(Integer id);
    List<RegistroFacialDTO> findAll();
    RegistroFacialDTO update(Integer id, RegistroFacialDTO registroFacialDTO);
    void delete(Integer id);
    Optional<RegistroFacialDTO> findByAlumnoId(Integer idAlumno);
    List<RegistroFacialDTO> findByEstado(String estado);
}