import express from 'express';
import { SolicitudService } from '../services/solicitud.service';

const router = express.Router();

router.get('/table', async (req: any, res: any) => {
  try {
    const solicitudes = await SolicitudService.getAllSolicitudesInTable();
    
    if (!Array.isArray(solicitudes) && solicitudes.error) {
      return res.status(solicitudes.status).json({ message: solicitudes.error });
    }
    
    return res.status(200).json(solicitudes);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/details/:id', async (req, res) => {
  const solicitud = await SolicitudService.getSolicitudDetails(Number(req.params.id));
  
  if (!solicitud) {
    res.status(404).json({ message: 'Solicitud not found' });
  }
  res.status(200).json(solicitud);
});

router.post('/create', async (req: any, res: any) => {

  const { solicitudData, clienteData } = req.body;

  if (!solicitudData) {
    return res.status(400).json({ error: 'Solicitud data is required' });
  }

  try {
    const result = await SolicitudService.createSolicitud(solicitudData, clienteData);
    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }
    return res.status(result.status).json(result.solicitud);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/update/:id', async (req: any, res: any) => {
  try {
    const solicitud = await SolicitudService.updateSolicitud(Number(req.params.id), req.body);
    if (solicitud.error) {
      return res.status(solicitud.status).json({ message: solicitud.error });
    }
    return res.status(solicitud.status).json(solicitud.solicitud);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/delete/:id', async (req: any, res: any) => {
  try {
    const solicitud = await SolicitudService.deleteSolicitud(Number(req.params.id));
    if (solicitud.error) {
      return res.status(solicitud.status).json({ message: solicitud.error });
    }
    return res.status(solicitud.status).json(solicitud);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;