package mx.uam.cua.proyecto.repository;

import mx.uam.cua.proyecto.entity.BitacoraAdministrador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BitacoraAdministradorRepository extends JpaRepository<BitacoraAdministrador, Integer> {
    List<BitacoraAdministrador> findByAdminIdAdmin(Integer idAdmin);
    List<BitacoraAdministrador> findByEntidadAfectada(String entidad);
    List<BitacoraAdministrador> findByFechaHoraBetween(LocalDateTime inicio, LocalDateTime fin);
    List<BitacoraAdministrador> findByAccionContaining(String accion);
}