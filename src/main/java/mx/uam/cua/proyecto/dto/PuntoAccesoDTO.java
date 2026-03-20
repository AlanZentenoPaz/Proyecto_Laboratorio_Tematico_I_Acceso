package mx.uam.cua.proyecto.dto;

public class PuntoAccesoDTO {
    private Integer idPuntoAcceso;
    private String nombre;
    private String ubicacion;
    private String tipo;
    private String estado;

    // Constructores
    public PuntoAccesoDTO() {}

    // Getters y Setters
    public Integer getIdPuntoAcceso() { return idPuntoAcceso; }
    public void setIdPuntoAcceso(Integer idPuntoAcceso) { this.idPuntoAcceso = idPuntoAcceso; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String ubicacion) { this.ubicacion = ubicacion; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}