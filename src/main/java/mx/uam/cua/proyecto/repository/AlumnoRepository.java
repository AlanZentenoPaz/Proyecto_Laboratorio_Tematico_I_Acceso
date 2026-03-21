package mx.uam.cua.proyecto.repository;

import mx.uam.cua.proyecto.entity.Alumno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface AlumnoRepository extends JpaRepository<Alumno, Integer> {
    Optional<Alumno> findByMatricula(String matricula);
    Optional<Alumno> findByCorreoInstitucional(String correo);
    List<Alumno> findByLicenciatura(String licenciatura);
    List<Alumno> findByEstatusAcademico(Alumno.EstatusAcademico estatus);
    List<Alumno> findByEstadoCuenta(Alumno.EstadoCuenta estado);
    boolean existsByMatricula(String matricula);
    boolean existsByCorreoInstitucional(String correo);
}