package mx.uam.cua.proyecto.controller;

import mx.uam.cua.proyecto.dto.AdministradorDTO;
import mx.uam.cua.proyecto.service.AdministradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/administradores")
public class AdministradorController {

    @Autowired
    private AdministradorService administradorService;

    @GetMapping
    public ResponseEntity<List<AdministradorDTO>> getAllAdministradores() {
        return ResponseEntity.ok(administradorService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdministradorDTO> getAdministradorById(@PathVariable Integer id) {
        return administradorService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{usuario}")
    public ResponseEntity<AdministradorDTO> getAdministradorByUsuario(@PathVariable String usuario) {
        return administradorService.findByUsuario(usuario)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/correo/{correo}")
    public ResponseEntity<AdministradorDTO> getAdministradorByCorreo(@PathVariable String correo) {
        return administradorService.findByCorreo(correo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AdministradorDTO> createAdministrador(@RequestBody AdministradorDTO administradorDTO) {
        try {
            AdministradorDTO created = administradorService.create(administradorDTO);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdministradorDTO> updateAdministrador(@PathVariable Integer id,
                                                                @RequestBody AdministradorDTO administradorDTO) {
        try {
            AdministradorDTO updated = administradorService.update(id, administradorDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdministrador(@PathVariable Integer id) {
        try {
            administradorService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}