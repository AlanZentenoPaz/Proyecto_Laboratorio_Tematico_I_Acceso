package mx.uam.cua.proyecto.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "administrador")
public class Administrador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_admin")
    private Integer idAdmin;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String apellidos;

    @Column(name = "correo_institucional", nullable = false, length = 150)
    private String correoInstitucional;

    @Column(length = 20)
    private String telefono;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Rol rol;

    @Column(unique = true, nullable = false, length = 50)
    private String usuario;

    @Column(name = "contrasena_hash", nullable = false, length = 255)
    private String contrasenaHash;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Estado estado = Estado.Activo;

    @OneToMany(mappedBy = "adminRegistro")
    private List<Alumno> alumnosRegistrados;

    @OneToMany(mappedBy = "adminAutorizo")
    private List<Credencial> credencialesAutorizadas;

    @OneToMany(mappedBy = "adminAutorizo")
    private List<RegistroFacial> registrosFaciales;

    @OneToMany(mappedBy = "admin")
    private List<BitacoraAdministrador> bitacoras;

    public enum Rol {
        Seguridad, Sistemas, General
    }

    public enum Estado {
        Activo, Inactivo
    }

    // Getters y Setters
    public Integer getIdAdmin() { return idAdmin; }
    public void setIdAdmin(Integer idAdmin) { this.idAdmin = idAdmin; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellidos() { return apellidos; }
    public void setApellidos(String apellidos) { this.apellidos = apellidos; }

    public String getCorreoInstitucional() { return correoInstitucional; }
    public void setCorreoInstitucional(String correoInstitucional) { this.correoInstitucional = correoInstitucional; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public Rol getRol() { return rol; }
    public void setRol(Rol rol) { this.rol = rol; }

    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }

    public String getContrasenaHash() { return contrasenaHash; }
    public void setContrasenaHash(String contrasenaHash) { this.contrasenaHash = contrasenaHash; }

    public Estado getEstado() { return estado; }
    public void setEstado(Estado estado) { this.estado = estado; }
}