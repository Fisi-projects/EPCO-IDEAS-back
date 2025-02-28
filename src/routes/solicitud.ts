import express from 'express';
import { SolicitudService } from '../services/solicitud.service';

const router = express.Router();

/**
 * @openapi
 * /solicitudes/table:
 *   get:
 *     tags:
 *       - Solicitud
 *     summary: Get all solicitudes in table format
 *     responses:
 *       200:
 *         description: List of solicitudes
 *       500:
 *         description: Internal server error
 */
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

/**
 * @openapi
 * /solicitudes/details/{id}:
 *   get:
 *     tags:
 *       - Solicitud
 *     summary: Get solicitud details by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Solicitud details
 *       404:
 *         description: Solicitud not found
 *       500:
 *         description: Internal server error
 */
router.get('/details/:id', async (req, res) => {
  const solicitud = await SolicitudService.getSolicitudDetails(Number(req.params.id));
  
  if (!solicitud) {
    res.status(404).json({ message: 'Solicitud not found' });
  }
  res.status(200).json(solicitud);
});

/**
 * @openapi
 * /solicitudes/create:
 *   post:
 *     tags:
 *       - Solicitud
 *     summary: Create a new solicitud
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SolicitudCreated'
 *     responses:
 *       201:
 *         description: Solicitud created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
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

/**
 * @openapi
 * /solicitudes/update/{id}:
 *   put:
 *     tags:
 *       - Solicitud
 *     summary: Update a solicitud
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SolicitudUpdate'
 *     responses:
 *       200:
 *         description: Solicitud updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Solicitud not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @openapi
 * /solicitudes/delete/{id}:
 *   delete:
 *     tags:
 *       - Solicitud
 *     summary: Delete a solicitud
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Solicitud deleted successfully
 *       404:
 *         description: Solicitud not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @openapi
 * /solicitudes/pdf/{id}:
 *   get:
 *     tags:
 *       - Solicitud
 *     summary: Generate PDF for a solicitud
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PDF generated successfully
 *       404:
 *         description: Solicitud not found
 *       500:
 *         description: Internal server error
 */
router.get('/pdf/:id', async (req: any, res: any) => {
  try {
    const id = Number(req.params.id);
    const result = await SolicitudService.generateSolicitudPdf(id);
    
    if ('error' in result) {
      return res.status(result.status).json({ message: result.error });
    }
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=solicitud_${id}.pdf`);
    
    res.send(result.pdf);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;