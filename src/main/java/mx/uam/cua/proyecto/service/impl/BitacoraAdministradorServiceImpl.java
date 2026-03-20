package mx.uam.cua.proyecto.service.impl;

import mx.uam.cua.proyecto.dto.BitacoraAdministradorDTO;
import mx.uam.cua.proyecto.entity.BitacoraAdministrador;
import mx.uam.cua.proyecto.entity.Administrador;
import mx.uam.cua.proyecto.repository.BitacoraAdministradorRepository;
import mx.uam.cua.proyecto.repository.AdministradorRepository;
import mx.uam.cua.proyecto.service.BitacoraAdministradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class BitacoraAdministradorServiceImpl implements BitacoraAdministradorService {

    @Autowired
    private BitacoraAdministradorRepository bitacoraRepository;

    @Autowired
    private AdministradorRepository administradorRepository;

    @Override
    public BitacoraAdministradorDTO create(BitacoraAdministradorDTO bitacoraDTO) {
        BitacoraAdministrador bitacora = convertToEntity(bitacoraDTO);
        bitacora.setFechaHora(LocalDateTime.now());
        bitacora = bitacoraRepository.save(bitacora);
        return convertToDTO(bitacora);
    }

    @Override
    public Optional<BitacoraAdministradorDTO> findById(Integer id) {
        return bitacoraRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    public List<BitacoraAdministradorDTO> findAll() {
        return bitacoraRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BitacoraAdministradorDTO update(Integer id, BitacoraAdministradorDTO bitacoraDTO) {
        BitacoraAdministrador bitacora = bitacoraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro de bitácora no encontrado"));

        updateEntity(bitacora, bitacoraDTO);
        bitacora = bitacoraRepository.save(bitacora);
        return convertToDTO(bitacora);
    }

    @Override
    public void delete(Integer id) {
        if (!bitacoraRepository.existsById(id)) {
            throw new RuntimeException("Registro de bitácora no encontrado");
        }
        bitacoraRepository.deleteById(id);
    }

    @Override
    public List<BitacoraAdministradorDTO> findByAdminId(Integer idAdmin) {
        return bitacoraRepository.findByAdminIdAdmin(idAdmin).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<BitacoraAdministradorDTO> findByEntidadAfectada(String entidad) {
        return bitacoraRepository.findByEntidadAfectada(entidad).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<BitacoraAdministradorDTO> findByFechaBetween(LocalDateTime inicio, LocalDateTime fin) {
        return bitacoraRepository.findByFechaHoraBetween(inicio, fin).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private BitacoraAdministrador convertToEntity(BitacoraAdministradorDTO dto) {
        BitacoraAdministrador bitacora = new BitacoraAdministrador();
        bitacora.setIdBitacora(dto.getIdBitacora());
        bitacora.setAccion(dto.getAccion());
        bitacora.setEntidadAfectada(dto.getEntidadAfectada());
        bitacora.setIdRegistroAfectado(dto.getIdRegistroAfectado());
        bitacora.setDescripcion(dto.getDescripcion());
        bitacora.setFechaHora(dto.getFechaHora());

        if (dto.getIdAdmin() != null) {
            Administrador admin = administradorRepository.findById(dto.getIdAdmin())
                    .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));
            bitacora.setAdmin(admin);
        }

        return bitacora;
    }

    private BitacoraAdministradorDTO convertToDTO(BitacoraAdministrador bitacora) {
        BitacoraAdministradorDTO dto = new BitacoraAdministradorDTO();
        dto.setIdBitacora(bitacora.getIdBitacora());
        dto.setAccion(bitacora.getAccion());
        dto.setEntidadAfectada(bitacora.getEntidadAfectada());
        dto.setIdRegistroAfectado(bitacora.getIdRegistroAfectado());
        dto.setDescripcion(bitacora.getDescripcion());
        dto.setFechaHora(bitacora.getFechaHora());

        if (bitacora.getAdmin() != null) {
            dto.setIdAdmin(bitacora.getAdmin().getIdAdmin());
        }

        return dto;
    }

    private void updateEntity(BitacoraAdministrador bitacora, BitacoraAdministradorDTO dto) {
        bitacora.setAccion(dto.getAccion());
        bitacora.setEntidadAfectada(dto.getEntidadAfectada());
        bitacora.setIdRegistroAfectado(dto.getIdRegistroAfectado());
        bitacora.setDescripcion(dto.getDescripcion());

        if (dto.getIdAdmin() != null) {
            Administrador admin = administradorRepository.findById(dto.getIdAdmin())
                    .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));
            bitacora.setAdmin(admin);
        } else {
            bitacora.setAdmin(null);
        }
    }
}