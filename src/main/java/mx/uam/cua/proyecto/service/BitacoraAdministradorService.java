package mx.uam.cua.proyecto.service;

import mx.uam.cua.proyecto.dto.BitacoraAdministradorDTO;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BitacoraAdministradorService {
    BitacoraAdministradorDTO create(BitacoraAdministradorDTO bitacoraDTO);
    Optional<BitacoraAdministradorDTO> findById(Integer id);
    List<BitacoraAdministradorDTO> findAll();
    BitacoraAdministradorDTO update(Integer id, BitacoraAdministradorDTO bitacoraDTO);
    void delete(Integer id);
    List<BitacoraAdministradorDTO> findByAdminId(Integer idAdmin);
    List<BitacoraAdministradorDTO> findByEntidadAfectada(String entidad);
    List<BitacoraAdministradorDTO> findByFechaBetween(LocalDateTime inicio, LocalDateTime fin);
}