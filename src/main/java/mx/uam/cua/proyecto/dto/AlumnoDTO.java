package mx.uam.cua.proyecto.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AlumnoDTO {
    private Integer idAlumno;
    private String matricula;
    private String nombre;
    private String apellidos;
    private String correoInstitucional;
    private String telefono;
    private LocalDate fechaNacimiento;
    private String licenciatura;
    private Integer trimestreActual;
    private String estatusAcademico;
    private LocalDateTime fechaRegistro;
    private String estadoCuenta;
    private Integer idAdminRegistro;

    // Constructores
    public AlumnoDTO() {}

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

    public String getEstatusAcademico() { return estatusAcademico; }
    public void setEstatusAcademico(String estatusAcademico) { this.estatusAcademico = estatusAcademico; }

    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }

    public String getEstadoCuenta() { return estadoCuenta; }
    public void setEstadoCuenta(String estadoCuenta) { this.estadoCuenta = estadoCuenta; }

    public Integer getIdAdminRegistro() { return idAdminRegistro; }
    public void setIdAdminRegistro(Integer idAdminRegistro) { this.idAdminRegistro = idAdminRegistro; }
}