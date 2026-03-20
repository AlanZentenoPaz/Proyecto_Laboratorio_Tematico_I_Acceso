package mx.uam.cua.proyecto.service.impl;

import mx.uam.cua.proyecto.dto.RegistroFacialDTO;
import mx.uam.cua.proyecto.entity.RegistroFacial;
import mx.uam.cua.proyecto.entity.Alumno;
import mx.uam.cua.proyecto.entity.Administrador;
import mx.uam.cua.proyecto.repository.RegistroFacialRepository;
import mx.uam.cua.proyecto.repository.AlumnoRepository;
import mx.uam.cua.proyecto.repository.AdministradorRepository;
import mx.uam.cua.proyecto.service.RegistroFacialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class RegistroFacialServiceImpl implements RegistroFacialService {

    @Autowired
    private RegistroFacialRepository registroFacialRepository;

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private AdministradorRepository administradorRepository;

    @Override
    public RegistroFacialDTO create(RegistroFacialDTO registroFacialDTO) {
        if (registroFacialDTO.getIdAlumno() != null) {
            if (registroFacialRepository.existsByAlumnoIdAlumno(registroFacialDTO.getIdAlumno())) {
                throw new RuntimeException("El alumno ya tiene un registro facial");
            }
        }

        RegistroFacial registroFacial = convertToEntity(registroFacialDTO);
        registroFacial.setFechaRegistro(LocalDateTime.now());
        registroFacial = registroFacialRepository.save(registroFacial);
        return convertToDTO(registroFacial);
    }

    @Override
    public Optional<RegistroFacialDTO> findById(Integer id) {
        return registroFacialRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    public List<RegistroFacialDTO> findAll() {
        return registroFacialRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RegistroFacialDTO update(Integer id, RegistroFacialDTO registroFacialDTO) {
        RegistroFacial registroFacial = registroFacialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro facial no encontrado"));

        // Verificar si se está cambiando el alumno
        if (registroFacialDTO.getIdAlumno() != null
                && !registroFacialDTO.getIdAlumno().equals(
                registroFacial.getAlumno() != null ?
                        registroFacial.getAlumno().getIdAlumno() : null)) {
            if (registroFacialRepository.existsByAlumnoIdAlumno(registroFacialDTO.getIdAlumno())) {
                throw new RuntimeException("El alumno ya tiene otro registro facial");
            }
        }

        updateEntity(registroFacial, registroFacialDTO);
        registroFacial.setFechaActualizacion(LocalDateTime.now());
        registroFacial = registroFacialRepository.save(registroFacial);
        return convertToDTO(registroFacial);
    }

    @Override
    public void delete(Integer id) {
        if (!registroFacialRepository.existsById(id)) {
            throw new RuntimeException("Registro facial no encontrado");
        }
        registroFacialRepository.deleteById(id);
    }

    @Override
    public Optional<RegistroFacialDTO> findByAlumnoId(Integer idAlumno) {
        return registroFacialRepository.findByAlumnoIdAlumno(idAlumno)
                .map(this::convertToDTO);
    }

    @Override
    public List<RegistroFacialDTO> findByEstado(String estado) {
        RegistroFacial.Estado estadoEnum = RegistroFacial.Estado.valueOf(estado);
        return registroFacialRepository.findByEstado(estadoEnum).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private RegistroFacial convertToEntity(RegistroFacialDTO dto) {
        RegistroFacial registroFacial = new RegistroFacial();
        registroFacial.setIdRegistroFacial(dto.getIdRegistroFacial());
        registroFacial.setPlantillaFacial(dto.getPlantillaFacial());
        registroFacial.setFechaRegistro(dto.getFechaRegistro());
        registroFacial.setFechaActualizacion(dto.getFechaActualizacion());
        registroFacial.setEstado(RegistroFacial.Estado.valueOf(dto.getEstado()));

        if (dto.getIdAlumno() != null) {
            Alumno alumno = alumnoRepository.findById(dto.getIdAlumno())
                    .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));
            registroFacial.setAlumno(alumno);
        }

        if (dto.getIdAdminAutorizo() != null) {
            Administrador admin = administradorRepository.findById(dto.getIdAdminAutorizo())
                    .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));
            registroFacial.setAdminAutorizo(admin);
        }

        return registroFacial;
    }

    private RegistroFacialDTO convertToDTO(RegistroFacial registroFacial) {
        RegistroFacialDTO dto = new RegistroFacialDTO();
        dto.setIdRegistroFacial(registroFacial.getIdRegistroFacial());
        dto.setPlantillaFacial(registroFacial.getPlantillaFacial());
        dto.setFechaRegistro(registroFacial.getFechaRegistro());
        dto.setFechaActualizacion(registroFacial.getFechaActualizacion());
        dto.setEstado(registroFacial.getEstado().name());

        if (registroFacial.getAlumno() != null) {
            dto.setIdAlumno(registroFacial.getAlumno().getIdAlumno());
        }

        if (registroFacial.getAdminAutorizo() != null) {
            dto.setIdAdminAutorizo(registroFacial.getAdminAutorizo().getIdAdmin());
        }

        return dto;
    }

    private void updateEntity(RegistroFacial registroFacial, RegistroFacialDTO dto) {
        registroFacial.setPlantillaFacial(dto.getPlantillaFacial());
        registroFacial.setEstado(RegistroFacial.Estado.valueOf(dto.getEstado()));

        if (dto.getIdAlumno() != null) {
            Alumno alumno = alumnoRepository.findById(dto.getIdAlumno())
                    .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));
            registroFacial.setAlumno(alumno);
        } else {
            registroFacial.setAlumno(null);
        }

        if (dto.getIdAdminAutorizo() != null) {
            Administrador admin = administradorRepository.findById(dto.getIdAdminAutorizo())
                    .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));
            registroFacial.setAdminAutorizo(admin);
        } else {
            registroFacial.setAdminAutorizo(null);
        }
    }
}