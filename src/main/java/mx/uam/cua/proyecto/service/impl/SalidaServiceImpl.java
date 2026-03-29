package mx.uam.cua.proyecto.service.impl;

import mx.uam.cua.proyecto.dto.SalidaDTO;
import mx.uam.cua.proyecto.entity.Salida;
import mx.uam.cua.proyecto.entity.Alumno;
import mx.uam.cua.proyecto.entity.PuntoAcceso;
import mx.uam.cua.proyecto.repository.SalidaRepository;
import mx.uam.cua.proyecto.repository.AlumnoRepository;
import mx.uam.cua.proyecto.repository.PuntoAccesoRepository;
import mx.uam.cua.proyecto.service.SalidaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class SalidaServiceImpl implements SalidaService {

    @Autowired
    private SalidaRepository salidaRepository;

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private PuntoAccesoRepository puntoAccesoRepository;

    @Override
    public SalidaDTO create(SalidaDTO salidaDTO) {
        Salida salida = convertToEntity(salidaDTO);
        salida.setFechaHora(LocalDateTime.now());
        salida = salidaRepository.save(salida);
        return convertToDTO(salida);
    }

    @Override
    public Optional<SalidaDTO> findById(Integer id) {
        return salidaRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    public List<SalidaDTO> findAll() {
        return salidaRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SalidaDTO update(Integer id, SalidaDTO salidaDTO) {
        Salida salida = salidaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Salida no encontrada"));

        updateEntity(salida, salidaDTO);
        salida = salidaRepository.save(salida);
        return convertToDTO(salida);
    }

    @Override
    public void delete(Integer id) {
        if (!salidaRepository.existsById(id)) {
            throw new RuntimeException("Salida no encontrada");
        }
        salidaRepository.deleteById(id);
    }

    @Override
    public List<SalidaDTO> findByAlumnoId(Integer idAlumno) {
        return salidaRepository.findByAlumnoIdAlumno(idAlumno).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SalidaDTO> findByPuntoAccesoId(Integer idPuntoAcceso) {
        return salidaRepository.findByPuntoAccesoIdPuntoAcceso(idPuntoAcceso).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SalidaDTO> findByFechaBetween(LocalDateTime inicio, LocalDateTime fin) {
        return salidaRepository.findByFechaHoraBetween(inicio, fin).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SalidaDTO> findUltimasSalidasByAlumno(Integer idAlumno) {
        return salidaRepository.findUltimasSalidasByAlumno(idAlumno).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private Salida convertToEntity(SalidaDTO dto) {
        Salida salida = new Salida();
        salida.setIdSalida(dto.getIdSalida());
        salida.setFechaHora(dto.getFechaHora());
        salida.setMetodoAutenticacion(Salida.MetodoAutenticacion.valueOf(dto.getMetodoAutenticacion()));
        salida.setResultado(Salida.Resultado.valueOf(dto.getResultado()));

        if (dto.getIdAlumno() != null) {
            Alumno alumno = alumnoRepository.findById(dto.getIdAlumno())
                    .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));
            salida.setAlumno(alumno);
        }

        if (dto.getIdPuntoAcceso() != null) {
            PuntoAcceso puntoAcceso = puntoAccesoRepository.findById(dto.getIdPuntoAcceso())
                    .orElseThrow(() -> new RuntimeException("Punto de acceso no encontrado"));
            salida.setPuntoAcceso(puntoAcceso);
        }

        return salida;
    }

    private SalidaDTO convertToDTO(Salida salida) {
        SalidaDTO dto = new SalidaDTO();
        dto.setIdSalida(salida.getIdSalida());
        dto.setFechaHora(salida.getFechaHora());
        dto.setMetodoAutenticacion(salida.getMetodoAutenticacion().name());
        dto.setResultado(salida.getResultado().name());

        if (salida.getAlumno() != null) {
            dto.setIdAlumno(salida.getAlumno().getIdAlumno());
        }

        if (salida.getPuntoAcceso() != null) {
            dto.setIdPuntoAcceso(salida.getPuntoAcceso().getIdPuntoAcceso());
        }

        return dto;
    }

    private void updateEntity(Salida salida, SalidaDTO dto) {
        salida.setMetodoAutenticacion(Salida.MetodoAutenticacion.valueOf(dto.getMetodoAutenticacion()));
        salida.setResultado(Salida.Resultado.valueOf(dto.getResultado()));

        if (dto.getIdAlumno() != null) {
            Alumno alumno = alumnoRepository.findById(dto.getIdAlumno())
                    .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));
            salida.setAlumno(alumno);
        } else {
            salida.setAlumno(null);
        }

        if (dto.getIdPuntoAcceso() != null) {
            PuntoAcceso puntoAcceso = puntoAccesoRepository.findById(dto.getIdPuntoAcceso())
                    .orElseThrow(() -> new RuntimeException("Punto de acceso no encontrado"));
            salida.setPuntoAcceso(puntoAcceso);
        } else {
            salida.setPuntoAcceso(null);
        }
    }
}