package mx.uam.cua.proyecto.service.impl;

import mx.uam.cua.proyecto.dto.AlumnoDTO;
import mx.uam.cua.proyecto.entity.Alumno;
import mx.uam.cua.proyecto.entity.Administrador;
import mx.uam.cua.proyecto.repository.AlumnoRepository;
import mx.uam.cua.proyecto.repository.AdministradorRepository;
import mx.uam.cua.proyecto.service.AlumnoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class AlumnoServiceImpl implements AlumnoService {

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private AdministradorRepository administradorRepository;

    @Override
    public AlumnoDTO create(AlumnoDTO alumnoDTO) {
        if (alumnoRepository.existsByMatricula(alumnoDTO.getMatricula())) {
            throw new RuntimeException("La matrícula ya existe");
        }
        if (alumnoRepository.existsByCorreoInstitucional(alumnoDTO.getCorreoInstitucional())) {
            throw new RuntimeException("El correo institucional ya existe");
        }

        Alumno alumno = convertToEntity(alumnoDTO);
        alumno = alumnoRepository.save(alumno);
        return convertToDTO(alumno);
    }

    @Override
    public Optional<AlumnoDTO> findById(Integer id) {
        return alumnoRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    public List<AlumnoDTO> findAll() {
        return alumnoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AlumnoDTO update(Integer id, AlumnoDTO alumnoDTO) {
        Alumno alumno = alumnoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));

        // Verificar unicidad si se está cambiando la matrícula
        if (!alumno.getMatricula().equals(alumnoDTO.getMatricula())
                && alumnoRepository.existsByMatricula(alumnoDTO.getMatricula())) {
            throw new RuntimeException("La matrícula ya existe");
        }

        // Verificar unicidad si se está cambiando el correo
        if (!alumno.getCorreoInstitucional().equals(alumnoDTO.getCorreoInstitucional())
                && alumnoRepository.existsByCorreoInstitucional(alumnoDTO.getCorreoInstitucional())) {
            throw new RuntimeException("El correo institucional ya existe");
        }

        updateEntity(alumno, alumnoDTO);
        alumno = alumnoRepository.save(alumno);
        return convertToDTO(alumno);
    }

    @Override
    public void delete(Integer id) {
        if (!alumnoRepository.existsById(id)) {
            throw new RuntimeException("Alumno no encontrado");
        }
        alumnoRepository.deleteById(id);
    }

    @Override
    public Optional<AlumnoDTO> findByMatricula(String matricula) {
        return alumnoRepository.findByMatricula(matricula)
                .map(this::convertToDTO);
    }

    @Override
    public List<AlumnoDTO> findByLicenciatura(String licenciatura) {
        return alumnoRepository.findByLicenciatura(licenciatura).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AlumnoDTO> findByEstatusAcademico(String estatus) {
        Alumno.EstatusAcademico estatusEnum = Alumno.EstatusAcademico.valueOf(estatus);
        return alumnoRepository.findByEstatusAcademico(estatusEnum).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AlumnoDTO> findByEstadoCuenta(String estado) {
        Alumno.EstadoCuenta estadoEnum = Alumno.EstadoCuenta.valueOf(estado);
        return alumnoRepository.findByEstadoCuenta(estadoEnum).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private Alumno convertToEntity(AlumnoDTO dto) {
        Alumno alumno = new Alumno();
        alumno.setIdAlumno(dto.getIdAlumno());
        alumno.setMatricula(dto.getMatricula());
        alumno.setNombre(dto.getNombre());
        alumno.setApellidos(dto.getApellidos());
        alumno.setCorreoInstitucional(dto.getCorreoInstitucional());
        alumno.setTelefono(dto.getTelefono());
        alumno.setFechaNacimiento(dto.getFechaNacimiento());
        alumno.setLicenciatura(dto.getLicenciatura());
        alumno.setTrimestreActual(dto.getTrimestreActual());
        alumno.setEstatusAcademico(Alumno.EstatusAcademico.valueOf(dto.getEstatusAcademico()));
        alumno.setFechaRegistro(dto.getFechaRegistro());
        alumno.setEstadoCuenta(Alumno.EstadoCuenta.valueOf(dto.getEstadoCuenta()));

        if (dto.getIdAdminRegistro() != null) {
            Administrador admin = administradorRepository.findById(dto.getIdAdminRegistro())
                    .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));
            alumno.setAdminRegistro(admin);
        }

        return alumno;
    }

    private AlumnoDTO convertToDTO(Alumno alumno) {
        AlumnoDTO dto = new AlumnoDTO();
        dto.setIdAlumno(alumno.getIdAlumno());
        dto.setMatricula(alumno.getMatricula());
        dto.setNombre(alumno.getNombre());
        dto.setApellidos(alumno.getApellidos());
        dto.setCorreoInstitucional(alumno.getCorreoInstitucional());
        dto.setTelefono(alumno.getTelefono());
        dto.setFechaNacimiento(alumno.getFechaNacimiento());
        dto.setLicenciatura(alumno.getLicenciatura());
        dto.setTrimestreActual(alumno.getTrimestreActual());
        dto.setEstatusAcademico(alumno.getEstatusAcademico().name());
        dto.setFechaRegistro(alumno.getFechaRegistro());
        dto.setEstadoCuenta(alumno.getEstadoCuenta().name());

        if (alumno.getAdminRegistro() != null) {
            dto.setIdAdminRegistro(alumno.getAdminRegistro().getIdAdmin());
        }

        return dto;
    }

    private void updateEntity(Alumno alumno, AlumnoDTO dto) {
        alumno.setMatricula(dto.getMatricula());
        alumno.setNombre(dto.getNombre());
        alumno.setApellidos(dto.getApellidos());
        alumno.setCorreoInstitucional(dto.getCorreoInstitucional());
        alumno.setTelefono(dto.getTelefono());
        alumno.setFechaNacimiento(dto.getFechaNacimiento());
        alumno.setLicenciatura(dto.getLicenciatura());
        alumno.setTrimestreActual(dto.getTrimestreActual());
        alumno.setEstatusAcademico(Alumno.EstatusAcademico.valueOf(dto.getEstatusAcademico()));
        alumno.setEstadoCuenta(Alumno.EstadoCuenta.valueOf(dto.getEstadoCuenta()));

        if (dto.getIdAdminRegistro() != null) {
            Administrador admin = administradorRepository.findById(dto.getIdAdminRegistro())
                    .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));
            alumno.setAdminRegistro(admin);
        }
    }
}