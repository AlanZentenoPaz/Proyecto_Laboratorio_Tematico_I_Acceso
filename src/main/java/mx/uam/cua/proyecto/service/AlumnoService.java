package mx.uam.cua.proyecto.service;

import mx.uam.cua.proyecto.dto.AlumnoDTO;
import java.util.List;
import java.util.Optional;

public interface AlumnoService {
    AlumnoDTO create(AlumnoDTO alumnoDTO);
    Optional<AlumnoDTO> findById(Integer id);
    List<AlumnoDTO> findAll();
    AlumnoDTO update(Integer id, AlumnoDTO alumnoDTO);
    void delete(Integer id);
    Optional<AlumnoDTO> findByMatricula(String matricula);
    List<AlumnoDTO> findByLicenciatura(String licenciatura);
    List<AlumnoDTO> findByEstatusAcademico(String estatus);
    List<AlumnoDTO> findByEstadoCuenta(String estado);
} 