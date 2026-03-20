package mx.uam.cua.proyecto.repository;

import mx.uam.cua.proyecto.entity.Credencial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface CredencialRepository extends JpaRepository<Credencial, Integer> {
    Optional<Credencial> findByCodigoQr(String codigoQr);
    Optional<Credencial> findByAlumnoIdAlumno(Integer idAlumno);
    List<Credencial> findByEstatus(Credencial.Estatus estatus);
    List<Credencial> findByAdminAutorizoIdAdmin(Integer idAdmin);
    boolean existsByCodigoQr(String codigoQr);
}