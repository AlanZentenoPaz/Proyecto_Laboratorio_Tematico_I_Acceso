package mx.uam.cua.proyecto.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.List;

@Entity
@Table(name = "punto_acceso")
public class PuntoAcceso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_punto_acceso")
    private Integer idPuntoAcceso;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 150)
    private String ubicacion;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Tipo tipo;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Estado estado = Estado.Activo;

    @OneToMany(mappedBy = "puntoAcceso")
    private List<Acceso> accesos;

    public enum Tipo {
        Principal, Secundario
    }

    public enum Estado {
        Activo, Inactivo
    }

    // Getters y Setters
    public Integer getIdPuntoAcceso() { return idPuntoAcceso; }
    public void setIdPuntoAcceso(Integer idPuntoAcceso) { this.idPuntoAcceso = idPuntoAcceso; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String ubicacion) { this.ubicacion = ubicacion; }

    public Tipo getTipo() { return tipo; }
    public void setTipo(Tipo tipo) { this.tipo = tipo; }

    public Estado getEstado() { return estado; }
    public void setEstado(Estado estado) { this.estado = estado; }
}