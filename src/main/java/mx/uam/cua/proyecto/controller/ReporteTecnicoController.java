package mx.uam.cua.proyecto.controller;

import mx.uam.cua.proyecto.dto.ReporteTecnicoDTO;
import mx.uam.cua.proyecto.service.ReporteTecnicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/reportes-tecnicos")
public class ReporteTecnicoController {

    @Autowired
    private ReporteTecnicoService reporteTecnicoService;

    @GetMapping
    public ResponseEntity<List<ReporteTecnicoDTO>> getAllReportes() {
        return ResponseEntity.ok(reporteTecnicoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReporteTecnicoDTO> getReporteById(@PathVariable Integer id) {
        return reporteTecnicoService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/fecha/{fecha}")
    public ResponseEntity<List<ReporteTecnicoDTO>> getReportesByFecha(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        return ResponseEntity.ok(reporteTecnicoService.findByFecha(fecha));
    }

    @GetMapping("/fecha-rango")
    public ResponseEntity<List<ReporteTecnicoDTO>> getReportesByFechaBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(reporteTecnicoService.findByFechaBetween(inicio, fin));
    }

    @GetMapping("/torniquete/{numero}")
    public ResponseEntity<List<ReporteTecnicoDTO>> getReportesByNumeroTorniquete(
            @PathVariable Integer numero) {
        if (numero < 1 || numero > 4) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(reporteTecnicoService.findByNumeroTorniquete(numero));
    }

    @GetMapping("/reporta/{reporta}")
    public ResponseEntity<List<ReporteTecnicoDTO>> getReportesByReporta(@PathVariable String reporta) {
        try {
            return ResponseEntity.ok(reporteTecnicoService.findByReporta(reporta));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ReporteTecnicoDTO>> searchReportesByDescripcion(
            @RequestParam String keyword) {
        return ResponseEntity.ok(reporteTecnicoService.searchByDescripcion(keyword));
    }

    @GetMapping("/torniquete-fecha")
    public ResponseEntity<List<ReporteTecnicoDTO>> getReportesByFechaAndTorniquete(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
            @RequestParam Integer numero) {
        if (numero < 1 || numero > 4) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(reporteTecnicoService.findByFechaAndNumeroTorniquete(fecha, numero));
    }

    @GetMapping("/hora-rango")
    public ResponseEntity<List<ReporteTecnicoDTO>> getReportesByFechaAndHoraBetween(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime horaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime horaFin) {
        return ResponseEntity.ok(reporteTecnicoService.findByFechaAndHoraBetween(fecha, horaInicio, horaFin));
    }

    @PostMapping
    public ResponseEntity<ReporteTecnicoDTO> createReporte(@RequestBody ReporteTecnicoDTO reporteDTO) {
        try {
            ReporteTecnicoDTO created = reporteTecnicoService.create(reporteDTO);
            return new ResponseEntity<>(created, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReporteTecnicoDTO> updateReporte(@PathVariable Integer id,
                                                           @RequestBody ReporteTecnicoDTO reporteDTO) {
        try {
            ReporteTecnicoDTO updated = reporteTecnicoService.update(id, reporteDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReporte(@PathVariable Integer id) {
        try {
            reporteTecnicoService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}