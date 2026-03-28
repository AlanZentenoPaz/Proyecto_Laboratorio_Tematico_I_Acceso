package mx.uam.cua.proyecto.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class ReporteTecnicoDTO {
    private Integer idReporte;
    private LocalDate fecha;
    private LocalTime hora;
    private Integer numeroTorniquete;
    private String reporta;
    private String descripcion;

    // Constructores
    public ReporteTecnicoDTO() {}

    public ReporteTecnicoDTO(Integer idReporte, LocalDate fecha, LocalTime hora,
                             Integer numeroTorniquete, String reporta, String descripcion) {
        this.idReporte = idReporte;
        this.fecha = fecha;
        this.hora = hora;
        this.numeroTorniquete = numeroTorniquete;
        this.reporta = reporta;
        this.descripcion = descripcion;
    }

    // Getters y Setters
    public Integer getIdReporte() {
        return idReporte;
    }

    public void setIdReporte(Integer idReporte) {
        this.idReporte = idReporte;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public LocalTime getHora() {
        return hora;
    }

    public void setHora(LocalTime hora) {
        this.hora = hora;
    }

    public Integer getNumeroTorniquete() {
        return numeroTorniquete;
    }

    public void setNumeroTorniquete(Integer numeroTorniquete) {
        this.numeroTorniquete = numeroTorniquete;
    }

    public String getReporta() {
        return reporta;
    }

    public void setReporta(String reporta) {
        this.reporta = reporta;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}