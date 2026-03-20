package mx.uam.cua.proyecto.dto;

import java.time.LocalDateTime;

public class RegistroFacialDTO {
    private Integer idRegistroFacial;
    private String plantillaFacial;
    private LocalDateTime fechaRegistro;
    private LocalDateTime fechaActualizacion;
    private String estado;
    private Integer idAlumno;
    private Integer idAdminAutorizo;

    // Constructores
    public RegistroFacialDTO() {}

    // Getters y Setters
    public Integer getIdRegistroFacial() { return idRegistroFacial; }
    public void setIdRegistroFacial(Integer idRegistroFacial) { this.idRegistroFacial = idRegistroFacial; }

    public String getPlantillaFacial() { return plantillaFacial; }
    public void setPlantillaFacial(String plantillaFacial) { this.plantillaFacial = plantillaFacial; }

    public LocalDateTime getFechaRegistro() { return fechaRegistro; }
    public void setFechaRegistro(LocalDateTime fechaRegistro) { this.fechaRegistro = fechaRegistro; }

    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public Integer getIdAlumno() { return idAlumno; }
    public void setIdAlumno(Integer idAlumno) { this.idAlumno = idAlumno; }

    public Integer getIdAdminAutorizo() { return idAdminAutorizo; }
    public void setIdAdminAutorizo(Integer idAdminAutorizo) { this.idAdminAutorizo = idAdminAutorizo; }
}