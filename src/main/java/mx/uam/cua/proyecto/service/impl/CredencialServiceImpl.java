package mx.uam.cua.proyecto.service.impl;

import mx.uam.cua.proyecto.dto.CredencialDTO;
import mx.uam.cua.proyecto.entity.Credencial;
import mx.uam.cua.proyecto.entity.Alumno;
import mx.uam.cua.proyecto.entity.Administrador;
import mx.uam.cua.proyecto.repository.CredencialRepository;
import mx.uam.cua.proyecto.repository.AlumnoRepository;
import mx.uam.cua.proyecto.repository.AdministradorRepository;
import mx.uam.cua.proyecto.service.CredencialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CredencialServiceImpl implements CredencialService {

    @Autowired
    private CredencialRepository credencialRepository;

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private AdministradorRepository administradorRepository;

    @Override
    public CredencialDTO create(CredencialDTO credencialDTO) {
        if (credencialRepository.existsByCodigoQr(credencialDTO.getCodigoQr())) {
            throw new RuntimeException("El código QR ya existe");
        }

        if (credencialDTO.getIdAlumno() != null) {
            Optional<Credencial> credencialExistente = credencialRepository
                    .findByAlumnoIdAlumno(credencialDTO.getIdAlumno());
            if (credencialExistente.isPresent()) {
                throw new RuntimeException("El alumno ya tiene una credencial asignada");
            }
        }

        Credencial credencial = convertToEntity(credencialDTO);
        credencial = credencialRepository.save(credencial);
        return convertToDTO(credencial);
    }

    @Override
    public Optional<CredencialDTO> findById(Integer id) {
        return credencialRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    public List<CredencialDTO> findAll() {
        return credencialRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CredencialDTO update(Integer id, CredencialDTO credencialDTO) {
        Credencial credencial = credencialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Credencial no encontrada"));

        // Verificar unicidad del código QR si se está cambiando
        if (!credencial.getCodigoQr().equals(credencialDTO.getCodigoQr())
                && credencialRepository.existsByCodigoQr(credencialDTO.getCodigoQr())) {
            throw new RuntimeException("El código QR ya existe");
        }

        // Verificar si se está cambiando el alumno
        if (credencialDTO.getIdAlumno() != null) {
            Optional<Credencial> credencialExistente = credencialRepository
                    .findByAlumnoIdAlumno(credencialDTO.getIdAlumno());
            if (credencialExistente.isPresent()
                    && !credencialExistente.get().getIdCredencial().equals(id)) {
                throw new RuntimeException("El alumno ya tiene otra credencial asignada");
            }
        }

        updateEntity(credencial, credencialDTO);
        credencial = credencialRepository.save(credencial);
        return convertToDTO(credencial);
    }

    @Override
    public void delete(Integer id) {
        if (!credencialRepository.existsById(id)) {
            throw new RuntimeException("Credencial no encontrada");
        }
        credencialRepository.deleteById(id);
    }

    @Override
    public Optional<CredencialDTO> findByCodigoQr(String codigoQr) {
        return credencialRepository.findByCodigoQr(codigoQr)
                .map(this::convertToDTO);
    }

    @Override
    public Optional<CredencialDTO> findByAlumnoId(Integer idAlumno) {
        return credencialRepository.findByAlumnoIdAlumno(idAlumno)
                .map(this::convertToDTO);
    }

    @Override
    public List<CredencialDTO> findByEstatus(String estatus) {
        Credencial.Estatus estatusEnum = Credencial.Estatus.valueOf(estatus);
        return credencialRepository.findByEstatus(estatusEnum).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private Credencial convertToEntity(CredencialDTO dto) {
        Credencial credencial = new Credencial();
        credencial.setIdCredencial(dto.getIdCredencial());
        credencial.setCodigoQr(dto.getCodigoQr());
        credencial.setFechaEmision(dto.getFechaEmision());
        credencial.setFechaExpiracion(dto.getFechaExpiracion());
        credencial.setEstatus(Credencial.Estatus.valueOf(dto.getEstatus()));

        if (dto.getIdAlumno() != null) {
            Alumno alumno = alumnoRepository.findById(dto.getIdAlumno())
                    .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));
            credencial.setAlumno(alumno);
        }

        if (dto.getIdAdminAutorizo() != null) {
            Administrador admin = administradorRepository.findById(dto.getIdAdminAutorizo())
                    .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));
            credencial.setAdminAutorizo(admin);
        }

        return credencial;
    }

    private CredencialDTO convertToDTO(Credencial credencial) {
        CredencialDTO dto = new CredencialDTO();
        dto.setIdCredencial(credencial.getIdCredencial());
        dto.setCodigoQr(credencial.getCodigoQr());
        dto.setFechaEmision(credencial.getFechaEmision());
        dto.setFechaExpiracion(credencial.getFechaExpiracion());
        dto.setEstatus(credencial.getEstatus().name());

        if (credencial.getAlumno() != null) {
            dto.setIdAlumno(credencial.getAlumno().getIdAlumno());
        }

        if (credencial.getAdminAutorizo() != null) {
            dto.setIdAdminAutorizo(credencial.getAdminAutorizo().getIdAdmin());
        }

        return dto;
    }

    private void updateEntity(Credencial credencial, CredencialDTO dto) {
        credencial.setCodigoQr(dto.getCodigoQr());
        credencial.setFechaEmision(dto.getFechaEmision());
        credencial.setFechaExpiracion(dto.getFechaExpiracion());
        credencial.setEstatus(Credencial.Estatus.valueOf(dto.getEstatus()));

        if (dto.getIdAlumno() != null) {
            Alumno alumno = alumnoRepository.findById(dto.getIdAlumno())
                    .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));
            credencial.setAlumno(alumno);
        } else {
            credencial.setAlumno(null);
        }

        if (dto.getIdAdminAutorizo() != null) {
            Administrador admin = administradorRepository.findById(dto.getIdAdminAutorizo())
                    .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));
            credencial.setAdminAutorizo(admin);
        } else {
            credencial.setAdminAutorizo(null);
        }
    }
}