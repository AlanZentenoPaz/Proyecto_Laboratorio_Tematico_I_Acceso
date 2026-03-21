package mx.uam.cua.proyecto.controller;

import mx.uam.cua.proyecto.dto.AlumnoDTO;
import mx.uam.cua.proyecto.service.AlumnoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alumnos")
public class AlumnoController {

    @Autowired
    private AlumnoService alumnoService;

    @GetMapping
    public ResponseEntity<List<AlumnoDTO>> getAllAlumnos() {
        return ResponseEntity.ok(alumnoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlumnoDTO> getAlumnoById(@PathVariable Integer id) {
        return alumnoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/matricula/{matricula}")
    public ResponseEntity<AlumnoDTO> getAlumnoByMatricula(@PathVariable String matricula) {
        return alumnoService.findByMatricula(matricula)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/licenciatura/{licenciatura}")
    public ResponseEntity<List<AlumnoDTO>> getAlumnosByLicenciatura(@PathVariable String licenciatura) {
        return ResponseEntity.ok(alumnoService.findByLicenciatura(licenciatura));
    }

    @GetMapping("/estatus/{estatus}")
    public ResponseEntity<List<AlumnoDTO>> getAlumnosByEstatusAcademico(@PathVariable String estatus) {
        try {
            return ResponseEntity.ok(alumnoService.findByEstatusAcademico(estatus));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/estado-cuenta/{estado}")
    public ResponseEntity<List<AlumnoDTO>> getAlumnosByEstadoCuenta(@PathVariable String estado) {
        try {
            return ResponseEntity.ok(alumnoService.findByEstadoCuenta(estado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<AlumnoDTO> createAlumno(@RequestBody AlumnoDTO alumnoDTO) {
        try {
            AlumnoDTO created = alumnoService.create(alumnoDTO);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlumnoDTO> updateAlumno(@PathVariable Integer id,
                                                  @RequestBody AlumnoDTO alumnoDTO) {
        try {
            AlumnoDTO updated = alumnoService.update(id, alumnoDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlumno(@PathVariable Integer id) {
        try {
            alumnoService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}