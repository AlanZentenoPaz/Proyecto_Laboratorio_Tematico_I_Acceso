package mx.uam.cua.proyecto.controller;

import mx.uam.cua.proyecto.dto.SalidaDTO;
import mx.uam.cua.proyecto.service.SalidaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/salidas")
public class SalidaController {

    @Autowired
    private SalidaService salidaService;

    @GetMapping
    public ResponseEntity<List<SalidaDTO>> getAllSalidas() {
        return ResponseEntity.ok(salidaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalidaDTO> getSalidaById(@PathVariable Integer id) {
        return salidaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/alumno/{idAlumno}")
    public ResponseEntity<List<SalidaDTO>> getSalidasByAlumnoId(@PathVariable Integer idAlumno) {
        return ResponseEntity.ok(salidaService.findByAlumnoId(idAlumno));
    }

    @GetMapping("/punto-acceso/{idPuntoAcceso}")
    public ResponseEntity<List<SalidaDTO>> getSalidasByPuntoAccesoId(@PathVariable Integer idPuntoAcceso) {
        return ResponseEntity.ok(salidaService.findByPuntoAccesoId(idPuntoAcceso));
    }

    @GetMapping("/fecha")
    public ResponseEntity<List<SalidaDTO>> getSalidasByFechaBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        return ResponseEntity.ok(salidaService.findByFechaBetween(inicio, fin));
    }

    @GetMapping("/alumno/{idAlumno}/ultimos")
    public ResponseEntity<List<SalidaDTO>> getUltimasSalidasByAlumno(@PathVariable Integer idAlumno) {
        return ResponseEntity.ok(salidaService.findUltimasSalidasByAlumno(idAlumno));
    }

    @PostMapping
    public ResponseEntity<SalidaDTO> createSalida(@RequestBody SalidaDTO salidaDTO) {
        try {
            SalidaDTO created = salidaService.create(salidaDTO);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalidaDTO> updateSalida(@PathVariable Integer id,
                                                  @RequestBody SalidaDTO salidaDTO) {
        try {
            SalidaDTO updated = salidaService.update(id, salidaDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSalida(@PathVariable Integer id) {
        try {
            salidaService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}