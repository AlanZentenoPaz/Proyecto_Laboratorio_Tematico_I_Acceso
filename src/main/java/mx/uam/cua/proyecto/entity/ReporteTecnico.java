package mx.uam.cua.proyecto.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "reporte_tecnico")
public class ReporteTecnico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reporte")
    private Integer idReporte;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "hora", nullable = false)
    private LocalTime hora;

    @Column(name = "numero_torniquete", nullable = false)
    private Integer numeroTorniquete;

    @Column(name = "reporta", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private TipoReporta reporta;

    @Column(name = "descripcion", nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    // Enumeración para el tipo de persona que reporta
    public enum TipoReporta {
        Alumno, Profesor, Otro
    }

    // Constructores
    public ReporteTecnico() {}

    public ReporteTecnico(LocalDate fecha, LocalTime hora, Integer numeroTorniquete,
                          TipoReporta reporta, String descripcion) {
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
        // Validar que el número de torniquete esté entre 1 y 4
        if (numeroTorniquete < 1 || numeroTorniquete > 4) {
            throw new IllegalArgumentException("El número de torniquete debe estar entre 1 y 4");
        }
        this.numeroTorniquete = numeroTorniquete;
    }

    public TipoReporta getReporta() {
        return reporta;
    }

    public void setReporta(TipoReporta reporta) {
        this.reporta = reporta;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}