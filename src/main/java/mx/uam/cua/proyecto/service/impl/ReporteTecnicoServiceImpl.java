package mx.uam.cua.proyecto.service.impl;

import mx.uam.cua.proyecto.dto.ReporteTecnicoDTO;
import mx.uam.cua.proyecto.entity.ReporteTecnico;
import mx.uam.cua.proyecto.repository.ReporteTecnicoRepository;
import mx.uam.cua.proyecto.service.ReporteTecnicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ReporteTecnicoServiceImpl implements ReporteTecnicoService {

    @Autowired
    private ReporteTecnicoRepository reporteTecnicoRepository;

    @Override
    public ReporteTecnicoDTO create(ReporteTecnicoDTO reporteDTO) {
        // Validar número de torniquete
        if (reporteDTO.getNumeroTorniquete() < 1 || reporteDTO.getNumeroTorniquete() > 4) {
            throw new RuntimeException("El número de torniquete debe estar entre 1 y 4");
        }

        ReporteTecnico reporte = convertToEntity(reporteDTO);

        // Si no se especifica fecha, usar la fecha actual
        if (reporte.getFecha() == null) {
            reporte.setFecha(LocalDate.now());
        }

        // Si no se especifica hora, usar la hora actual
        if (reporte.getHora() == null) {
            reporte.setHora(LocalTime.now());
        }

        reporte = reporteTecnicoRepository.save(reporte);
        return convertToDTO(reporte);
    }

    @Override
    public Optional<ReporteTecnicoDTO> findById(Integer id) {
        return reporteTecnicoRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    public List<ReporteTecnicoDTO> findAll() {
        return reporteTecnicoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ReporteTecnicoDTO update(Integer id, ReporteTecnicoDTO reporteDTO) {
        ReporteTecnico reporte = reporteTecnicoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reporte técnico no encontrado"));

        // Validar número de torniquete
        if (reporteDTO.getNumeroTorniquete() < 1 || reporteDTO.getNumeroTorniquete() > 4) {
            throw new RuntimeException("El número de torniquete debe estar entre 1 y 4");
        }

        updateEntity(reporte, reporteDTO);
        reporte = reporteTecnicoRepository.save(reporte);
        return convertToDTO(reporte);
    }

    @Override
    public void delete(Integer id) {
        if (!reporteTecnicoRepository.existsById(id)) {
            throw new RuntimeException("Reporte técnico no encontrado");
        }
        reporteTecnicoRepository.deleteById(id);
    }

    @Override
    public List<ReporteTecnicoDTO> findByFecha(LocalDate fecha) {
        return reporteTecnicoRepository.findByFecha(fecha).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReporteTecnicoDTO> findByFechaBetween(LocalDate fechaInicio, LocalDate fechaFin) {
        return reporteTecnicoRepository.findByFechaBetween(fechaInicio, fechaFin).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReporteTecnicoDTO> findByNumeroTorniquete(Integer numeroTorniquete) {
        return reporteTecnicoRepository.findByNumeroTorniquete(numeroTorniquete).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReporteTecnicoDTO> findByReporta(String reporta) {
        ReporteTecnico.TipoReporta tipo = ReporteTecnico.TipoReporta.valueOf(reporta);
        return reporteTecnicoRepository.findByReporta(tipo).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReporteTecnicoDTO> searchByDescripcion(String keyword) {
        return reporteTecnicoRepository.findByDescripcionContaining(keyword).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReporteTecnicoDTO> findByFechaAndNumeroTorniquete(LocalDate fecha, Integer numero) {
        return reporteTecnicoRepository.findByFechaAndNumeroTorniquete(fecha, numero).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReporteTecnicoDTO> findByFechaAndHoraBetween(LocalDate fecha, LocalTime horaInicio, LocalTime horaFin) {
        return reporteTecnicoRepository.findByFechaAndHoraBetween(fecha, horaInicio, horaFin).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ReporteTecnico convertToEntity(ReporteTecnicoDTO dto) {
        ReporteTecnico reporte = new ReporteTecnico();
        reporte.setIdReporte(dto.getIdReporte());
        reporte.setFecha(dto.getFecha());
        reporte.setHora(dto.getHora());
        reporte.setNumeroTorniquete(dto.getNumeroTorniquete());
        reporte.setReporta(ReporteTecnico.TipoReporta.valueOf(dto.getReporta()));
        reporte.setDescripcion(dto.getDescripcion());
        return reporte;
    }

    private ReporteTecnicoDTO convertToDTO(ReporteTecnico reporte) {
        ReporteTecnicoDTO dto = new ReporteTecnicoDTO();
        dto.setIdReporte(reporte.getIdReporte());
        dto.setFecha(reporte.getFecha());
        dto.setHora(reporte.getHora());
        dto.setNumeroTorniquete(reporte.getNumeroTorniquete());
        dto.setReporta(reporte.getReporta().name());
        dto.setDescripcion(reporte.getDescripcion());
        return dto;
    }

    private void updateEntity(ReporteTecnico reporte, ReporteTecnicoDTO dto) {
        if (dto.getFecha() != null) {
            reporte.setFecha(dto.getFecha());
        }
        if (dto.getHora() != null) {
            reporte.setHora(dto.getHora());
        }
        if (dto.getNumeroTorniquete() != null) {
            reporte.setNumeroTorniquete(dto.getNumeroTorniquete());
        }
        if (dto.getReporta() != null) {
            reporte.setReporta(ReporteTecnico.TipoReporta.valueOf(dto.getReporta()));
        }
        if (dto.getDescripcion() != null) {
            reporte.setDescripcion(dto.getDescripcion());
        }
    }
}