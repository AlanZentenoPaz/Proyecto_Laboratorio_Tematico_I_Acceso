package mx.uam.cua.proyecto.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "credencial")
public class Credencial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_credencial")
    private Integer idCredencial;

    @Column(name = "codigo_qr", unique = true, nullable = false, length = 255)
    private String codigoQr;

    @Column(name = "fecha_emision", nullable = false)
    private LocalDate fechaEmision;

    @Column(name = "fecha_expiracion", nullable = false)
    private LocalDate fechaExpiracion;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Estatus estatus;

    @OneToOne
    @JoinColumn(name = "id_alumno")
    private Alumno alumno;

    @ManyToOne
    @JoinColumn(name = "id_admin_autorizo")
    private Administrador adminAutorizo;

    public enum Estatus {
        Activa, Extraviada, En_tramite, Cancelada
    }

    // Getters y Setters
    public Integer getIdCredencial() { return idCredencial; }
    public void setIdCredencial(Integer idCredencial) { this.idCredencial = idCredencial; }

    public String getCodigoQr() { return codigoQr; }
    public void setCodigoQr(String codigoQr) { this.codigoQr = codigoQr; }

    public LocalDate getFechaEmision() { return fechaEmision; }
    public void setFechaEmision(LocalDate fechaEmision) { this.fechaEmision = fechaEmision; }

    public LocalDate getFechaExpiracion() { return fechaExpiracion; }
    public void setFechaExpiracion(LocalDate fechaExpiracion) { this.fechaExpiracion = fechaExpiracion; }

    public Estatus getEstatus() { return estatus; }
    public void setEstatus(Estatus estatus) { this.estatus = estatus; }

    public Alumno getAlumno() { return alumno; }
    public void setAlumno(Alumno alumno) { this.alumno = alumno; }

    public Administrador getAdminAutorizo() { return adminAutorizo; }
    public void setAdminAutorizo(Administrador adminAutorizo) { this.adminAutorizo = adminAutorizo; }
}