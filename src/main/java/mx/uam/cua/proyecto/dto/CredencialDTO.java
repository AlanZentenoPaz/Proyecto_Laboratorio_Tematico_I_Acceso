package mx.uam.cua.proyecto.dto;

import java.time.LocalDate;

public class CredencialDTO {
    private Integer idCredencial;
    private String codigoQr;
    private LocalDate fechaEmision;
    private LocalDate fechaExpiracion;
    private String estatus;
    private Integer idAlumno;
    private Integer idAdminAutorizo;

    // Constructores
    public CredencialDTO() {}

    // Getters y Setters
    public Integer getIdCredencial() { return idCredencial; }
    public void setIdCredencial(Integer idCredencial) { this.idCredencial = idCredencial; }

    public String getCodigoQr() { return codigoQr; }
    public void setCodigoQr(String codigoQr) { this.codigoQr = codigoQr; }

    public LocalDate getFechaEmision() { return fechaEmision; }
    public void setFechaEmision(LocalDate fechaEmision) { this.fechaEmision = fechaEmision; }

    public LocalDate getFechaExpiracion() { return fechaExpiracion; }
    public void setFechaExpiracion(LocalDate fechaExpiracion) { this.fechaExpiracion = fechaExpiracion; }

    public String getEstatus() { return estatus; }
    public void setEstatus(String estatus) { this.estatus = estatus; }

    public Integer getIdAlumno() { return idAlumno; }
    public void setIdAlumno(Integer idAlumno) { this.idAlumno = idAlumno; }

    public Integer getIdAdminAutorizo() { return idAdminAutorizo; }
    public void setIdAdminAutorizo(Integer idAdminAutorizo) { this.idAdminAutorizo = idAdminAutorizo; }
}