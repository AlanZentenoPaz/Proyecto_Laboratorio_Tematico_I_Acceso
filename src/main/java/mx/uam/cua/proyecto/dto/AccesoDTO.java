package mx.uam.cua.proyecto.dto;

import java.time.LocalDateTime;

public class AccesoDTO {
    private Integer idAcceso;
    private LocalDateTime fechaHora;
    private String metodoAutenticacion;
    private String resultado;
    private Integer idAlumno;
    private Integer idPuntoAcceso;

    public AccesoDTO() {}

    public Integer getIdAcceso() { return idAcceso; }
    public void setIdAcceso(Integer idAcceso) { this.idAcceso = idAcceso; }

    public LocalDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }

    public String getMetodoAutenticacion() { return metodoAutenticacion; }
    public void setMetodoAutenticacion(String metodoAutenticacion) { this.metodoAutenticacion = metodoAutenticacion; }

    public String getResultado() { return resultado; }
    public void setResultado(String resultado) { this.resultado = resultado; }

    public Integer getIdAlumno() { return idAlumno; }
    public void setIdAlumno(Integer idAlumno) { this.idAlumno = idAlumno; }

    public Integer getIdPuntoAcceso() { return idPuntoAcceso; }
    public void setIdPuntoAcceso(Integer idPuntoAcceso) { this.idPuntoAcceso = idPuntoAcceso; }
}