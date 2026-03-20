package mx.uam.cua.proyecto.controller;

import mx.uam.cua.proyecto.dto.BitacoraAdministradorDTO;
import mx.uam.cua.proyecto.service.BitacoraAdministradorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/bitacora")
public class BitacoraAdministradorController {

    @Autowired
    private BitacoraAdministradorService bitacoraService;

    @GetMapping
    public ResponseEntity<List<BitacoraAdministradorDTO>> getAllBitacora() {
        return ResponseEntity.ok(bitacoraService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BitacoraAdministradorDTO> getBitacoraById(@PathVariable Integer id) {
        return bitacoraService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/administrador/{idAdmin}")
    public ResponseEntity<List<BitacoraAdministradorDTO>> getBitacoraByAdminId(@PathVariable Integer idAdmin) {
        return ResponseEntity.ok(bitacoraService.findByAdminId(idAdmin));
    }

    @GetMapping("/entidad/{entidad}")
    public ResponseEntity<List<BitacoraAdministradorDTO>> getBitacoraByEntidadAfectada(@PathVariable String entidad) {
        return ResponseEntity.ok(bitacoraService.findByEntidadAfectada(entidad));
    }

    @GetMapping("/fecha")
    public ResponseEntity<List<BitacoraAdministradorDTO>> getBitacoraByFechaBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        return ResponseEntity.ok(bitacoraService.findByFechaBetween(inicio, fin));
    }

    @PostMapping
    public ResponseEntity<BitacoraAdministradorDTO> createBitacora(@RequestBody BitacoraAdministradorDTO bitacoraDTO) {
        try {
            BitacoraAdministradorDTO created = bitacoraService.create(bitacoraDTO);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<BitacoraAdministradorDTO> updateBitacora(@PathVariable Integer id,
                                                                   @RequestBody BitacoraAdministradorDTO bitacoraDTO) {
        try {
            BitacoraAdministradorDTO updated = bitacoraService.update(id, bitacoraDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBitacora(@PathVariable Integer id) {
        try {
            bitacoraService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}