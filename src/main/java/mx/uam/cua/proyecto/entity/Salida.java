package mx.uam.cua.proyecto.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "salida")
public class Salida {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_salida")
    private Integer idSalida;

    @Column(name = "fecha_hora")
    private LocalDateTime fechaHora = LocalDateTime.now();

    @Column(name = "metodo_autenticacion", nullable = false)
    @Enumerated(EnumType.STRING)
    private MetodoAutenticacion metodoAutenticacion;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Resultado resultado;

    @ManyToOne
    @JoinColumn(name = "id_alumno")
    private Alumno alumno;

    @ManyToOne
    @JoinColumn(name = "id_punto_acceso")
    private PuntoAcceso puntoAcceso;

    public enum MetodoAutenticacion {
        QR, Facial
    }

    public enum Resultado {
        Permitido, Denegado
    }

    public Integer getIdSalida() { return idSalida; }
    public void setIdSalida(Integer idSalida) { this.idSalida = idSalida; }

    public LocalDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }

    public MetodoAutenticacion getMetodoAutenticacion() { return metodoAutenticacion; }
    public void setMetodoAutenticacion(MetodoAutenticacion metodoAutenticacion) { this.metodoAutenticacion = metodoAutenticacion; }

    public Resultado getResultado() { return resultado; }
    public void setResultado(Resultado resultado) { this.resultado = resultado; }

    public Alumno getAlumno() { return alumno; }
    public void setAlumno(Alumno alumno) { this.alumno = alumno; }

    public PuntoAcceso getPuntoAcceso() { return puntoAcceso; }
    public void setPuntoAcceso(PuntoAcceso puntoAcceso) { this.puntoAcceso = puntoAcceso; }
}