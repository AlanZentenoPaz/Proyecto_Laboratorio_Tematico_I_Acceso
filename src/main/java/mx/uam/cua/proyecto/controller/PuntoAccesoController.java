package mx.uam.cua.proyecto.controller;

import mx.uam.cua.proyecto.dto.PuntoAccesoDTO;
import mx.uam.cua.proyecto.service.PuntoAccesoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/puntos-acceso")
public class PuntoAccesoController {

    @Autowired
    private PuntoAccesoService puntoAccesoService;

    @GetMapping
    public ResponseEntity<List<PuntoAccesoDTO>> getAllPuntosAcceso() {
        return ResponseEntity.ok(puntoAccesoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PuntoAccesoDTO> getPuntoAccesoById(@PathVariable Integer id) {
        return puntoAccesoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<PuntoAccesoDTO> getPuntoAccesoByNombre(@PathVariable String nombre) {
        return puntoAccesoService.findByNombre(nombre)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<PuntoAccesoDTO>> getPuntosAccesoByTipo(@PathVariable String tipo) {
        try {
            return ResponseEntity.ok(puntoAccesoService.findByTipo(tipo));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<PuntoAccesoDTO>> getPuntosAccesoByEstado(@PathVariable String estado) {
        try {
            return ResponseEntity.ok(puntoAccesoService.findByEstado(estado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<PuntoAccesoDTO> createPuntoAcceso(@RequestBody PuntoAccesoDTO puntoAccesoDTO) {
        try {
            PuntoAccesoDTO created = puntoAccesoService.create(puntoAccesoDTO);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<PuntoAccesoDTO> updatePuntoAcceso(@PathVariable Integer id,
                                                            @RequestBody PuntoAccesoDTO puntoAccesoDTO) {
        try {
            PuntoAccesoDTO updated = puntoAccesoService.update(id, puntoAccesoDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePuntoAcceso(@PathVariable Integer id) {
        try {
            puntoAccesoService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}