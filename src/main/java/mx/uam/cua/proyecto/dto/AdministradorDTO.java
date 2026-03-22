package mx.uam.cua.proyecto.dto;

public class AdministradorDTO {
    private Integer idAdmin;
    private String nombre;
    private String apellidos;
    private String correoInstitucional;
    private String telefono;
    private String rol;
    private String usuario;
    private String contrasenaHash;
    private String estado;

    // Constructor vacío
    public AdministradorDTO() {}

    // Constructor con 8 parámetros (SIN estado)
    public AdministradorDTO(Integer idAdmin, String nombre, String apellidos,
                            String correoInstitucional, String telefono,
                            String rol, String usuario, String contrasenaHash) {
        this.idAdmin = idAdmin;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.correoInstitucional = correoInstitucional;
        this.telefono = telefono;
        this.rol = rol;
        this.usuario = usuario;
        this.contrasenaHash = contrasenaHash;
    }

    // Constructor con 9 parámetros (CON estado)
    public AdministradorDTO(Integer idAdmin, String nombre, String apellidos,
                            String correoInstitucional, String telefono,
                            String rol, String usuario, String contrasenaHash,
                            String estado) {
        this.idAdmin = idAdmin;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.correoInstitucional = correoInstitucional;
        this.telefono = telefono;
        this.rol = rol;
        this.usuario = usuario;
        this.contrasenaHash = contrasenaHash;
        this.estado = estado;
    }

    // Getters y Setters
    public Integer getIdAdmin() { return idAdmin; }
    public void setIdAdmin(Integer idAdmin) { this.idAdmin = idAdmin; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellidos() { return apellidos; }
    public void setApellidos(String apellidos) { this.apellidos = apellidos; }

    public String getCorreoInstitucional() { return correoInstitucional; }
    public void setCorreoInstitucional(String correoInstitucional) { this.correoInstitucional = correoInstitucional; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }

    public String getContrasenaHash() { return contrasenaHash; }
    public void setContrasenaHash(String contrasenaHash) { this.contrasenaHash = contrasenaHash; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}