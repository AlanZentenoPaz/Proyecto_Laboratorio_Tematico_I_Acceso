package mx.uam.cua.proyecto.service.impl;

import mx.uam.cua.proyecto.dto.PuntoAccesoDTO;
import mx.uam.cua.proyecto.entity.PuntoAcceso;
import mx.uam.cua.proyecto.repository.PuntoAccesoRepository;
import mx.uam.cua.proyecto.service.PuntoAccesoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PuntoAccesoServiceImpl implements PuntoAccesoService {

    @Autowired
    private PuntoAccesoRepository puntoAccesoRepository;

    @Override
    public PuntoAccesoDTO create(PuntoAccesoDTO puntoAccesoDTO) {
        if (puntoAccesoRepository.existsByNombre(puntoAccesoDTO.getNombre())) {
            throw new RuntimeException("El nombre del punto de acceso ya existe");
        }

        PuntoAcceso puntoAcceso = convertToEntity(puntoAccesoDTO);
        puntoAcceso = puntoAccesoRepository.save(puntoAcceso);
        return convertToDTO(puntoAcceso);
    }

    @Override
    public Optional<PuntoAccesoDTO> findById(Integer id) {
        return puntoAccesoRepository.findById(id)
                .map(this::convertToDTO);
    }

    @Override
    public List<PuntoAccesoDTO> findAll() {
        return puntoAccesoRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PuntoAccesoDTO update(Integer id, PuntoAccesoDTO puntoAccesoDTO) {
        PuntoAcceso puntoAcceso = puntoAccesoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Punto de acceso no encontrado"));

        // Verificar unicidad del nombre si se está cambiando
        if (!puntoAcceso.getNombre().equals(puntoAccesoDTO.getNombre())
                && puntoAccesoRepository.existsByNombre(puntoAccesoDTO.getNombre())) {
            throw new RuntimeException("El nombre del punto de acceso ya existe");
        }

        updateEntity(puntoAcceso, puntoAccesoDTO);
        puntoAcceso = puntoAccesoRepository.save(puntoAcceso);
        return convertToDTO(puntoAcceso);
    }

    @Override
    public void delete(Integer id) {
        if (!puntoAccesoRepository.existsById(id)) {
            throw new RuntimeException("Punto de acceso no encontrado");
        }
        puntoAccesoRepository.deleteById(id);
    }

    @Override
    public Optional<PuntoAccesoDTO> findByNombre(String nombre) {
        return puntoAccesoRepository.findByNombre(nombre)
                .map(this::convertToDTO);
    }

    @Override
    public List<PuntoAccesoDTO> findByTipo(String tipo) {
        PuntoAcceso.Tipo tipoEnum = PuntoAcceso.Tipo.valueOf(tipo);
        return puntoAccesoRepository.findByTipo(tipoEnum).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<PuntoAccesoDTO> findByEstado(String estado) {
        PuntoAcceso.Estado estadoEnum = PuntoAcceso.Estado.valueOf(estado);
        return puntoAccesoRepository.findByEstado(estadoEnum).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private PuntoAcceso convertToEntity(PuntoAccesoDTO dto) {
        PuntoAcceso puntoAcceso = new PuntoAcceso();
        puntoAcceso.setIdPuntoAcceso(dto.getIdPuntoAcceso());
        puntoAcceso.setNombre(dto.getNombre());
        puntoAcceso.setUbicacion(dto.getUbicacion());
        puntoAcceso.setTipo(PuntoAcceso.Tipo.valueOf(dto.getTipo()));
        puntoAcceso.setEstado(PuntoAcceso.Estado.valueOf(dto.getEstado()));
        return puntoAcceso;
    }

    private PuntoAccesoDTO convertToDTO(PuntoAcceso puntoAcceso) {
        PuntoAccesoDTO dto = new PuntoAccesoDTO();
        dto.setIdPuntoAcceso(puntoAcceso.getIdPuntoAcceso());
        dto.setNombre(puntoAcceso.getNombre());
        dto.setUbicacion(puntoAcceso.getUbicacion());
        dto.setTipo(puntoAcceso.getTipo().name());
        dto.setEstado(puntoAcceso.getEstado().name());
        return dto;
    }

    private void updateEntity(PuntoAcceso puntoAcceso, PuntoAccesoDTO dto) {
        puntoAcceso.setNombre(dto.getNombre());
        puntoAcceso.setUbicacion(dto.getUbicacion());
        puntoAcceso.setTipo(PuntoAcceso.Tipo.valueOf(dto.getTipo()));
        puntoAcceso.setEstado(PuntoAcceso.Estado.valueOf(dto.getEstado()));
    }
}