package mx.uam.cua.proyecto.service;

import mx.uam.cua.proyecto.dto.CredencialDTO;
import java.util.List;
import java.util.Optional;

public interface CredencialService {
    CredencialDTO create(CredencialDTO credencialDTO);
    Optional<CredencialDTO> findById(Integer id);
    List<CredencialDTO> findAll();
    CredencialDTO update(Integer id, CredencialDTO credencialDTO);
    void delete(Integer id);
    Optional<CredencialDTO> findByCodigoQr(String codigoQr);
    Optional<CredencialDTO> findByAlumnoId(Integer idAlumno);
    List<CredencialDTO> findByEstatus(String estatus);
}