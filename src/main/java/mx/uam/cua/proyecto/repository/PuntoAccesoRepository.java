package mx.uam.cua.proyecto.repository;

import mx.uam.cua.proyecto.entity.PuntoAcceso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PuntoAccesoRepository extends JpaRepository<PuntoAcceso, Integer> {
    Optional<PuntoAcceso> findByNombre(String nombre);
    List<PuntoAcceso> findByTipo(PuntoAcceso.Tipo tipo);
    List<PuntoAcceso> findByEstado(PuntoAcceso.Estado estado);
    boolean existsByNombre(String nombre);
}