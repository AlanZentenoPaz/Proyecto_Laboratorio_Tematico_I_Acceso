package mx.uam.cua.proyecto.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bitacora_administrador")
public class BitacoraAdministrador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_bitacora")
    private Integer idBitacora;

    @Column(nullable = false, length = 150)
    private String accion;

    @Column(name = "entidad_afectada", nullable = false, length = 100)
    private String entidadAfectada;

    @Column(name = "id_registro_afectado")
    private Integer idRegistroAfectado;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "fecha_hora")
    private LocalDateTime fechaHora = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "id_admin")
    private Administrador admin;

    // Getters y Setters
    public Integer getIdBitacora() { return idBitacora; }
    public void setIdBitacora(Integer idBitacora) { this.idBitacora = idBitacora; }

    public String getAccion() { return accion; }
    public void setAccion(String accion) { this.accion = accion; }

    public String getEntidadAfectada() { return entidadAfectada; }
    public void setEntidadAfectada(String entidadAfectada) { this.entidadAfectada = entidadAfectada; }

    public Integer getIdRegistroAfectado() { return idRegistroAfectado; }
    public void setIdRegistroAfectado(Integer idRegistroAfectado) { this.idRegistroAfectado = idRegistroAfectado; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }

    public Administrador getAdmin() { return admin; }
    public void setAdmin(Administrador admin) { this.admin = admin; }
}