package mx.uam.cua.proyecto.service.impl;

import mx.uam.cua.proyecto.dto.AdministradorDTO;
import mx.uam.cua.proyecto.entity.Administrador;
import mx.uam.cua.proyecto.repository.AdministradorRepository;
import mx.uam.cua.proyecto.service.AdministradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdministradorServiceImpl implements AdministradorService {

    @Autowired
    private AdministradorRepository administradorRepository;

    @Override
    public AdministradorDTO create(AdministradorDTO administradorDTO) {
        if (existsByUsuario(administradorDTO.getUsuario())) {
            throw new RuntimeException("El usuario ya existe");
        }
        if (existsByCorreo(administradorDTO.getCorreoInstitucional())) {
            throw new RuntimeException("El correo institucional ya existe");
        }

        Administrador administrador = convertToEntity(administradorDTO);
        administrador = administradorRepository.save(administrador);
        return convertToDTO(administrador);
    }

    @Override
    public Optional<AdministradorDTO> findById(Integer id) {
        return administradorRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    public List<AdministradorDTO> findAll() {
        return administradorRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AdministradorDTO update(Integer id, AdministradorDTO administradorDTO) {
        Administrador administrador = administradorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));

        // Verificar unicidad si se está cambiando el usuario
        if (!administrador.getUsuario().equals(administradorDTO.getUsuario())
                && existsByUsuario(administradorDTO.getUsuario())) {
            throw new RuntimeException("El usuario ya existe");
        }

        // Verificar unicidad si se está cambiando el correo
        if (!administrador.getCorreoInstitucional().equals(administradorDTO.getCorreoInstitucional())
                && existsByCorreo(administradorDTO.getCorreoInstitucional())) {
            throw new RuntimeException("El correo institucional ya existe");
        }

        updateEntity(administrador, administradorDTO);
        administrador = administradorRepository.save(administrador);
        return convertToDTO(administrador);
    }

    @Override
    public void delete(Integer id) {
        if (!administradorRepository.existsById(id)) {
            throw new RuntimeException("Administrador no encontrado");
        }
        administradorRepository.deleteById(id);
    }

    @Override
    public Optional<AdministradorDTO> findByUsuario(String usuario) {
        return administradorRepository.findByUsuario(usuario)
                .map(this::convertToDTO);
    }

    @Override
    public Optional<AdministradorDTO> findByCorreo(String correo) {
        return administradorRepository.findByCorreoInstitucional(correo)
                .map(this::convertToDTO);
    }

    @Override
    public boolean existsByUsuario(String usuario) {
        return administradorRepository.existsByUsuario(usuario);
    }

    @Override
    public boolean existsByCorreo(String correo) {
        return administradorRepository.existsByCorreoInstitucional(correo);
    }

    private Administrador convertToEntity(AdministradorDTO dto) {
        Administrador admin = new Administrador();
        admin.setIdAdmin(dto.getIdAdmin());
        admin.setNombre(dto.getNombre());
        admin.setApellidos(dto.getApellidos());
        admin.setCorreoInstitucional(dto.getCorreoInstitucional());
        admin.setTelefono(dto.getTelefono());
        admin.setRol(Administrador.Rol.valueOf(dto.getRol()));
        admin.setUsuario(dto.getUsuario());
        admin.setContrasenaHash(dto.getContrasenaHash());
        admin.setEstado(Administrador.Estado.valueOf(dto.getEstado()));
        return admin;
    }

    private AdministradorDTO convertToDTO(Administrador admin) {
        AdministradorDTO dto = new AdministradorDTO(); // Constructor vacío
        dto.setIdAdmin(admin.getIdAdmin());
        dto.setNombre(admin.getNombre());
        dto.setApellidos(admin.getApellidos());
        dto.setCorreoInstitucional(admin.getCorreoInstitucional());
        dto.setTelefono(admin.getTelefono());
        dto.setRol(admin.getRol().name());
        dto.setUsuario(admin.getUsuario());
        dto.setContrasenaHash(admin.getContrasenaHash());
        dto.setEstado(admin.getEstado().name());
        return dto;
    }

    private void updateEntity(Administrador admin, AdministradorDTO dto) {
        admin.setNombre(dto.getNombre());
        admin.setApellidos(dto.getApellidos());
        admin.setCorreoInstitucional(dto.getCorreoInstitucional());
        admin.setTelefono(dto.getTelefono());
        admin.setRol(Administrador.Rol.valueOf(dto.getRol()));
        admin.setUsuario(dto.getUsuario());
        if (dto.getContrasenaHash() != null && !dto.getContrasenaHash().isEmpty()) {
            admin.setContrasenaHash(dto.getContrasenaHash());
        }
        admin.setEstado(Administrador.Estado.valueOf(dto.getEstado()));
    }
}