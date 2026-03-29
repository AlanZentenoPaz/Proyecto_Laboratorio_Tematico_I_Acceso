package mx.uam.cua.proyecto.dto;

import java.time.LocalDateTime;

public class SalidaDTO {
    private Integer idSalida;
    private LocalDateTime fechaHora;
    private String metodoAutenticacion;
    private String resultado;
    private Integer idAlumno;
    private Integer idPuntoAcceso;

    public SalidaDTO() {}

    public Integer getIdSalida() { return idSalida; }
    public void setIdSalida(Integer idSalida) { this.idSalida = idSalida; }

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