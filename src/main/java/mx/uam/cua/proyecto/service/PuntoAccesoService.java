package mx.uam.cua.proyecto.service;

import mx.uam.cua.proyecto.dto.PuntoAccesoDTO;
import java.util.List;
import java.util.Optional;

public interface PuntoAccesoService {
    PuntoAccesoDTO create(PuntoAccesoDTO puntoAccesoDTO);
    Optional<PuntoAccesoDTO> findById(Integer id);
    List<PuntoAccesoDTO> findAll();
    PuntoAccesoDTO update(Integer id, PuntoAccesoDTO puntoAccesoDTO);
    void delete(Integer id);
    Optional<PuntoAccesoDTO> findByNombre(String nombre);
    List<PuntoAccesoDTO> findByTipo(String tipo);
    List<PuntoAccesoDTO> findByEstado(String estado);
}