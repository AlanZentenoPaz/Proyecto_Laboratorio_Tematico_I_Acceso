package mx.uam.cua.proyecto.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "alumno")
public class Alumno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_alumno")
    private Integer idAlumno;

    @Column(unique = true, nullable = false, length = 20)
    private String matricula;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String apellidos;

    @Column(name = "correo_institucional", nullable = false, length = 150)
    private String correoInstitucional;

    @Column(length = 20)
    private String telefono;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Column(length = 100)
    private String licenciatura;

    @Column(name = "trimestre_actual")
    private Integer trimestreActual;

    @Column(name = "estatus_academico", nullable = false)
    @Enumerated(EnumType.STRING)
    private EstatusAcademico estatusAcademico;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro = LocalDateTime.now();

    @Column(name = "estado_cuenta")
    @Enumerated(EnumType.STRING)
    private EstadoCuenta estadoCuenta = EstadoCuenta.Activa;

    @ManyToOne
    @JoinColumn(name = "id_admin_registro")
    private Administrador adminRegistro;

    @OneToOne(mappedBy = "alumno")
    private Credencial credencial;

    @OneToOne(mappedBy = "alumno")
    private RegistroFacial registroFacial;

    @OneToMany(mappedBy = "alumno")
    private List<Acceso> accesos;

    public enum EstatusAcademico {
        Activo, Sin_carga, Egresado
    }

    public enum EstadoCuenta {
        Activa, Suspendida
    }

    // Getters y Setters
    public Integer getIdAlumno() { return idAlumno; }
    public void setIdAlumno(Integer idAlumno) { this.idAlumno = idAlumno; }

    public String getMatricula() { return matricula; }
    public void setMatricula(String matricula) { this.matricula = matricula; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellidos() { return apellidos; }
    public void setApellidos(String apellidos) { this.apellidos = apellidos; }

    public String getCorreoInstitucional() { return correoInstitucional; }
    public void setCorreoInstitucional(String correoInstitucional) { this.correoInstitucional = correoInstitucional; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public LocalDate getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(LocalDate fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }

    public String getLicenciatura() { return licenciatura; }
    public void setLicenciatura(String licenciatura) { this.licenciatura = licenciatura; }

    public Integer getTrimestreActual() { return trimestreActual; }
    public void setTrimestreActual(Integer trimestreActual) { this.trimestreActual = trimestreActual; }

    public EstatusAcademico getEstatusAcademico() { return estatusAcademico; }
    public void setEstatusAcademico(EstatusAcademico estatusAcademico) { this.estatusAcademico = estatusAcademico; }

    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }

    public EstadoCuenta getEstadoCuenta() { return estadoCuenta; }
    public void setEstadoCuenta(EstadoCuenta estadoCuenta) { this.estadoCuenta = estadoCuenta; }

    public Administrador getAdminRegistro() { return adminRegistro; }
    public void setAdminRegistro(Administrador adminRegistro) { this.adminRegistro = adminRegistro; }
}