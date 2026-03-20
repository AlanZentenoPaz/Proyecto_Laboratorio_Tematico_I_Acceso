package mx.uam.cua.proyecto.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "registro_facial")
public class RegistroFacial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_registro_facial")
    private Integer idRegistroFacial;

    @Column(name = "plantilla_facial", nullable = false, columnDefinition = "TEXT")
    private String plantillaFacial;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro = LocalDateTime.now();

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Estado estado = Estado.Activo;

    @OneToOne
    @JoinColumn(name = "id_alumno")
    private Alumno alumno;

    @ManyToOne
    @JoinColumn(name = "id_admin_autorizo")
    private Administrador adminAutorizo;

    public enum Estado {
        Activo, Inactivo
    }

    // Getters y Setters
    public Integer getIdRegistroFacial() { return idRegistroFacial; }
    public void setIdRegistroFacial(Integer idRegistroFacial) { this.idRegistroFacial = idRegistroFacial; }

    public String getPlantillaFacial() { return plantillaFacial; }
    public void setPlantillaFacial(String plantillaFacial) { this.plantillaFacial = plantillaFacial; }

    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }

    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }

    public Estado getEstado() { return estado; }
    public void setEstado(Estado estado) { this.estado = estado; }

    public Alumno getAlumno() { return alumno; }
    public void setAlumno(Alumno alumno) { this.alumno = alumno; }

    public Administrador getAdminAutorizo() { return adminAutorizo; }
    public void setAdminAutorizo(Administrador adminAutorizo) { this.adminAutorizo = adminAutorizo; }
}