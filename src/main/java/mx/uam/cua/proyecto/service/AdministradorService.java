package mx.uam.cua.proyecto.service;

import mx.uam.cua.proyecto.dto.AdministradorDTO;
import java.util.List;
import java.util.Optional;

public interface AdministradorService {
    AdministradorDTO create(AdministradorDTO administradorDTO);
    Optional<AdministradorDTO> findById(Integer id);
    List<AdministradorDTO> findAll();
    AdministradorDTO update(Integer id, AdministradorDTO administradorDTO);
    void delete(Integer id);
    Optional<AdministradorDTO> findByUsuario(String usuario);
    Optional<AdministradorDTO> findByCorreo(String correo);
    boolean existsByUsuario(String usuario);
    boolean existsByCorreo(String correo);
}