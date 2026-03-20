package mx.uam.cua.proyecto.controller;

import mx.uam.cua.proyecto.dto.CredencialDTO;
import mx.uam.cua.proyecto.service.CredencialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/credenciales")
public class CredencialController {

    @Autowired
    private CredencialService credencialService;

    @GetMapping
    public ResponseEntity<List<CredencialDTO>> getAllCredenciales() {
        return ResponseEntity.ok(credencialService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CredencialDTO> getCredencialById(@PathVariable Integer id) {
        return credencialService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/qr/{codigoQr}")
    public ResponseEntity<CredencialDTO> getCredencialByCodigoQr(@PathVariable String codigoQr) {
        return credencialService.findByCodigoQr(codigoQr)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/alumno/{idAlumno}")
    public ResponseEntity<CredencialDTO> getCredencialByAlumnoId(@PathVariable Integer idAlumno) {
        return credencialService.findByAlumnoId(idAlumno)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/estatus/{estatus}")
    public ResponseEntity<List<CredencialDTO>> getCredencialesByEstatus(@PathVariable String estatus) {
        try {
            return ResponseEntity.ok(credencialService.findByEstatus(estatus));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<CredencialDTO> createCredencial(@RequestBody CredencialDTO credencialDTO) {
        try {
            CredencialDTO created = credencialService.create(credencialDTO);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CredencialDTO> updateCredencial(@PathVariable Integer id,
                                                          @RequestBody CredencialDTO credencialDTO) {
        try {
            CredencialDTO updated = credencialService.update(id, credencialDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCredencial(@PathVariable Integer id) {
        try {
            credencialService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}