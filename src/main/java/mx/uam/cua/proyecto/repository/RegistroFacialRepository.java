package mx.uam.cua.proyecto.repository;

import mx.uam.cua.proyecto.entity.RegistroFacial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface RegistroFacialRepository extends JpaRepository<RegistroFacial, Integer> {
    Optional<RegistroFacial> findByAlumnoIdAlumno(Integer idAlumno);
    List<RegistroFacial> findByEstado(RegistroFacial.Estado estado);
    List<RegistroFacial> findByAdminAutorizoIdAdmin(Integer idAdmin);
    boolean existsByAlumnoIdAlumno(Integer idAlumno);
}