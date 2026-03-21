package mx.uam.cua.proyecto.controller;

import mx.uam.cua.proyecto.dto.AccesoDTO;
import mx.uam.cua.proyecto.service.AccesoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/accesos")
public class AccesoController {

    @Autowired
    private AccesoService accesoService;

    @GetMapping
    public ResponseEntity<List<AccesoDTO>> getAllAccesos() {
        return ResponseEntity.ok(accesoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccesoDTO> getAccesoById(@PathVariable Integer id) {
        return accesoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/alumno/{idAlumno}")
    public ResponseEntity<List<AccesoDTO>> getAccesosByAlumnoId(@PathVariable Integer idAlumno) {
        return ResponseEntity.ok(accesoService.findByAlumnoId(idAlumno));
    }

    @GetMapping("/punto-acceso/{idPuntoAcceso}")
    public ResponseEntity<List<AccesoDTO>> getAccesosByPuntoAccesoId(@PathVariable Integer idPuntoAcceso) {
        return ResponseEntity.ok(accesoService.findByPuntoAccesoId(idPuntoAcceso));
    }

    @GetMapping("/fecha")
    public ResponseEntity<List<AccesoDTO>> getAccesosByFechaBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        return ResponseEntity.ok(accesoService.findByFechaBetween(inicio, fin));
    }

    @GetMapping("/alumno/{idAlumno}/ultimos")
    public ResponseEntity<List<AccesoDTO>> getUltimosAccesosByAlumno(@PathVariable Integer idAlumno) {
        return ResponseEntity.ok(accesoService.findUltimosAccesosByAlumno(idAlumno));
    }

    @PostMapping
    public ResponseEntity<AccesoDTO> createAcceso(@RequestBody AccesoDTO accesoDTO) {
        try {
            AccesoDTO created = accesoService.create(accesoDTO);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccesoDTO> updateAcceso(@PathVariable Integer id,
                                                  @RequestBody AccesoDTO accesoDTO) {
        try {
            AccesoDTO updated = accesoService.update(id, accesoDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAcceso(@PathVariable Integer id) {
        try {
            accesoService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}