package mx.uam.cua.proyecto.dto;

import java.time.LocalDateTime;

public class BitacoraAdministradorDTO {
    private Integer idBitacora;
    private String accion;
    private String entidadAfectada;
    private Integer idRegistroAfectado;
    private String descripcion;
    private LocalDateTime fechaHora;
    private Integer idAdmin;

    // Constructores
    public BitacoraAdministradorDTO() {}

    // Getters y Setters
    public Integer getIdBitacora() { return idBitacora; }
    public void setIdBitacora(Integer idBitacora) { this.idBitacora = idBitacora; }

    public String getAccion() { return accion; }
    public void setAccion(String accion) { this.accion = accion; }

    public String getEntidadAfectada() { return entidadAfectada; }
    public void setEntidadAfectada(String entidadAfectada) { this.entidadAfectada = entidadAfectada; }

    public Integer getIdRegistroAfectado() { return idRegistroAfectado; }
    public void setIdRegistroAfectado(Integer idRegistroAfectado) { this.idRegistroAfectado = idRegistroAfectado; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalDateTime getFechaHora() { return fechaHora; }
    public void setFechaHora(LocalDateTime fechaHora) { this.fechaHora = fechaHora; }

    public Integer getIdAdmin() { return idAdmin; }
    public void setIdAdmin(Integer idAdmin) { this.idAdmin = idAdmin; }
}