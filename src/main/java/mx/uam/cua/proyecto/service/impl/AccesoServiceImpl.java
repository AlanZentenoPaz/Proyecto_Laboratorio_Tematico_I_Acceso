package mx.uam.cua.proyecto.service.impl;

import mx.uam.cua.proyecto.dto.AccesoDTO;
import mx.uam.cua.proyecto.entity.Alumno;
import mx.uam.cua.proyecto.entity.PuntoAcceso;
import mx.uam.cua.proyecto.repository.AccesoRepository;
import mx.uam.cua.proyecto.repository.AlumnoRepository;
import mx.uam.cua.proyecto.repository.PuntoAccesoRepository;
import mx.uam.cua.proyecto.service.AccesoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class AccesoServiceImpl implements AccesoService {

    @Autowired
    private AccesoRepository accesoRepository;

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private PuntoAccesoRepository puntoAccesoRepository;

    @Override
    public AccesoDTO create(AccesoDTO accesoDTO) {
        Acceso acceso = convertToEntity(accesoDTO);
        acceso.setFechaHora(LocalDateTime.now());
        acceso = accesoRepository.save(acceso);
        return convertToDTO(acceso);
    }

    @Override
    public Optional<AccesoDTO> findById(Integer id) {
        return accesoRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    public List<AccesoDTO> findAll() {
        return accesoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AccesoDTO update(Integer id, AccesoDTO accesoDTO) {
        Acceso acceso = accesoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Acceso no encontrado"));

        updateEntity(acceso, accesoDTO);
        acceso = accesoRepository.save(acceso);
        return convertToDTO(acceso);
    }

    @Override
    public void delete(Integer id) {
        if (!accesoRepository.existsById(id)) {
            throw new RuntimeException("Acceso no encontrado");
        }
        accesoRepository.deleteById(id);
    }

    @Override
    public List<AccesoDTO> findByAlumnoId(Integer idAlumno) {
        return accesoRepository.findByAlumnoIdAlumno(idAlumno).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AccesoDTO> findByPuntoAccesoId(Integer idPuntoAcceso) {
        return accesoRepository.findByPuntoAccesoIdPuntoAcceso(idPuntoAcceso).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AccesoDTO> findByFechaBetween(LocalDateTime inicio, LocalDateTime fin) {
        return accesoRepository.findByFechaHoraBetween(inicio, fin).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<AccesoDTO> findUltimosAccesosByAlumno(Integer idAlumno) {
        return accesoRepository.findUltimosAccesosByAlumno(idAlumno).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private Acceso convertToEntity(AccesoDTO dto) {
        Acceso acceso = new Acceso();
        acceso.setIdAcceso(dto.getIdAcceso());
        acceso.setFechaHora(dto.getFechaHora());
        acceso.setMetodoAutenticacion(Acceso.MetodoAutenticacion.valueOf(dto.getMetodoAutenticacion()));
        acceso.setResultado(Acceso.Resultado.valueOf(dto.getResultado()));

        if (dto.getIdAlumno() != null) {
            Alumno alumno = alumnoRepository.findById(dto.getIdAlumno())
                    .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));
            acceso.setAlumno(alumno);
        }

        if (dto.getIdPuntoAcceso() != null) {
            PuntoAcceso puntoAcceso = puntoAccesoRepository.findById(dto.getIdPuntoAcceso())
                    .orElseThrow(() -> new RuntimeException("Punto de acceso no encontrado"));
            acceso.setPuntoAcceso(puntoAcceso);
        }

        return acceso;
    }

    private AccesoDTO convertToDTO(Acceso acceso) {
        AccesoDTO dto = new AccesoDTO();
        dto.setIdAcceso(acceso.getIdAcceso());
        dto.setFechaHora(acceso.getFechaHora());
        dto.setMetodoAutenticacion(acceso.getMetodoAutenticacion().name());
        dto.setResultado(acceso.getResultado().name());

        if (acceso.getAlumno() != null) {
            dto.setIdAlumno(acceso.getAlumno().getIdAlumno());
        }

        if (acceso.getPuntoAcceso() != null) {
            dto.setIdPuntoAcceso(acceso.getPuntoAcceso().getIdPuntoAcceso());
        }

        return dto;
    }

    private void updateEntity(Acceso acceso, AccesoDTO dto) {
        acceso.setMetodoAutenticacion(Acceso.MetodoAutenticacion.valueOf(dto.getMetodoAutenticacion()));
        acceso.setResultado(Acceso.Resultado.valueOf(dto.getResultado()));

        if (dto.getIdAlumno() != null) {
            Alumno alumno = alumnoRepository.findById(dto.getIdAlumno())
                    .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));
            acceso.setAlumno(alumno);
        } else {
            acceso.setAlumno(null);
        }

        if (dto.getIdPuntoAcceso() != null) {
            PuntoAcceso puntoAcceso = puntoAccesoRepository.findById(dto.getIdPuntoAcceso())
                    .orElseThrow(() -> new RuntimeException("Punto de acceso no encontrado"));
            acceso.setPuntoAcceso(puntoAcceso);
        } else {
            acceso.setPuntoAcceso(null);
        }
    }
}