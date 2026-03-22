package mx.uam.cua.proyecto.repository;

import mx.uam.cua.proyecto.entity.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AdministradorRepository extends JpaRepository<Administrador, Integer> {
    Optional<Administrador> findByUsuario(String usuario);
    Optional<Administrador> findByCorreoInstitucional(String correo);
    boolean existsByUsuario(String usuario);
    boolean existsByCorreoInstitucional(String correo);
}