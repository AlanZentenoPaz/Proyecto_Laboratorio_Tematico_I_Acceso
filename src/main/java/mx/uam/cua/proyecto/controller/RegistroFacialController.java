package mx.uam.cua.proyecto.controller;

import mx.uam.cua.proyecto.dto.RegistroFacialDTO;
import mx.uam.cua.proyecto.service.RegistroFacialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/registros-faciales")
public class RegistroFacialController {

    @Autowired
    private RegistroFacialService registroFacialService;

    @GetMapping
    public ResponseEntity<List<RegistroFacialDTO>> getAllRegistrosFaciales() {
        return ResponseEntity.ok(registroFacialService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegistroFacialDTO> getRegistroFacialById(@PathVariable Integer id) {
        return registroFacialService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/alumno/{idAlumno}")
    public ResponseEntity<RegistroFacialDTO> getRegistroFacialByAlumnoId(@PathVariable Integer idAlumno) {
        return registroFacialService.findByAlumnoId(idAlumno)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<RegistroFacialDTO>> getRegistrosFacialesByEstado(@PathVariable String estado) {
        try {
            return ResponseEntity.ok(registroFacialService.findByEstado(estado));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<RegistroFacialDTO> createRegistroFacial(@RequestBody RegistroFacialDTO registroFacialDTO) {
        try {
            RegistroFacialDTO created = registroFacialService.create(registroFacialDTO);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<RegistroFacialDTO> updateRegistroFacial(@PathVariable Integer id,
                                                                  @RequestBody RegistroFacialDTO registroFacialDTO) {
        try {
            RegistroFacialDTO updated = registroFacialService.update(id, registroFacialDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRegistroFacial(@PathVariable Integer id) {
        try {
            registroFacialService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}