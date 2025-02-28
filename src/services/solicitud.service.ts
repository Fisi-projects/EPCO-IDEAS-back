import { SolicitudCreatedSchema, SolicitudDetailsSchema, SolicitudTableSchema, SolicitudUpdateSchema } from "../schemas/solicitud.schema";
import prisma from "../utils/connection";
import { UserService } from "./user.service";
import PDFDocument from 'pdfkit';

export class SolicitudService {
  static async getAllSolicitudesInTable () {
    try {
      const solicitudes = await prisma.solicitud.findMany({
        include: {
          tecnico: true,
          cliente: true,
          Solicitud_Product: {
            include: {
              product: true
            }
          }
        }
      });

      const solicitudesFormateadas = solicitudes.map(solicitud => ({
        id: solicitud.id,
        title: solicitud.title,
        cliente_nombre: solicitud.cliente.nombres + ' ' + solicitud.cliente.apellidos,
        cliente_celular: solicitud.cliente.telefono,
        productos_nombres: solicitud.Solicitud_Product.map(sp => sp.product.name),
        estado: solicitud.estado,
        tecnico_nombre: solicitud.tecnico.nombres + ' ' + solicitud.tecnico.apellidos,
        descripcion: solicitud.descripcion,
        fecha: solicitud.fecha.toString(),
        tecnico_id: solicitud.tecnico_id
      }));

      const validatedSolicitudes = solicitudesFormateadas.map(
        solicitud => SolicitudTableSchema.parse(solicitud)
      );
      
      return validatedSolicitudes;

    } catch (error) {
      console.log(error);
      return {
        error: 'Table solicitudes error: ', 
        status: 500
      };
    }
  }

  static async getSolicitudDetails (id: number) {
    try {
      const solicitud = await prisma.solicitud.findUnique({
        where: {
          id
        },
        include: {
          tecnico: true,
          cliente: true,
          Solicitud_Product: {
            include: {
              product: true
            }
          }
        }
      });

      if (!solicitud) {
        return {
          error: 'Solicitud not found',
          status: 404
        };
      }

      const solicitudFormateada = {
        title: solicitud.title,
        cliente_nombre: solicitud.cliente.nombres + ' ' + solicitud.cliente.apellidos,
        cliente_celular: solicitud.cliente.telefono,
        fecha: solicitud.fecha.toString(),
        productos_nombres: solicitud.Solicitud_Product.map(sp => sp.product.name),
        descripcion: solicitud.descripcion,
        estado: solicitud.estado,
        tecnico_nombre: solicitud.tecnico.nombres + ' ' + solicitud.tecnico.apellidos
      };

      const validatedSolicitud = SolicitudDetailsSchema.parse(solicitudFormateada);

      return validatedSolicitud;

    } catch (error) {
      console.log(error);
      return {
        error: 'Solicitud Details error: ', 
        status: 500
      };
    }
  }

  // Debe recibir un objeto con los datos de la solicitud y OPCIONALMENTE los datos del cliente
  static async createSolicitud (solicitudData: any, clienteData?: any) { //Si está vacía, se crea un cliente de 0
    try {
      // Variable que puede cambiar si se crea un cliente
      let cliente_id = solicitudData.cliente_id;

      // Si no se especifica un cliente_id, se intenta crear un cliente
      if (!cliente_id && clienteData) {
        const result = await UserService.registerCliente(clienteData);
        if (result.error) {
          return { error: result.error, status: result.status };
        }
        if (result.user) {
          cliente_id = result.user.id;
        } else {
          return { error: 'User creation failed', status: 500 };
        }
      }

      // Ahora recién se crea la solicitud con el cliente_id
      const solicitudValidated = SolicitudCreatedSchema.parse({
        ...solicitudData,
        cliente_id
      });

      const newSolicitud = await prisma.solicitud.create({
        data: {
          title: solicitudValidated.title,
          cliente_id: solicitudValidated.cliente_id,
          fecha: new Date(solicitudValidated.fecha),
          descripcion: solicitudValidated.descripcion,
          estado: solicitudValidated.estado,
          tecnico_id: solicitudValidated.tecnico_id
        }
      });

      // entradas en Solicitud_Product para cada producto
      if (solicitudData.productos && solicitudData.productos.length > 0) {
        const solicitudProductosData = solicitudData.productos.map((producto_id: number) => ({
          solicitud_id: newSolicitud.id,
          product_id: producto_id
        }));

        await prisma.solicitud_Product.createMany({
          data: solicitudProductosData
        });
      }

      return { solicitud: newSolicitud, status: 201 };

    } catch (error) {
      console.log(error);
      return {
        error: 'Solicitud creation failed',
        status: 500
      };
    }
  }

  // Que no se permita editar el id de productos o será todo un temón detrás  xdxd
  static async updateSolicitud (id: number, solicitudData: any) {
    try {
      const solicitud = await prisma.solicitud.findUnique({
        where: {
          id
        }
      });

      if (!solicitud) {
        return {
          error: 'Solicitud not found',
          status: 404
        };
      }

      const solicitudValidated = SolicitudUpdateSchema.parse(solicitudData);

      const updatedSolicitud = await prisma.solicitud.update({
        where: {
          id
        },
        data: {
          title: solicitudValidated.title ?? solicitud.title,
          fecha: solicitudValidated.fecha ? new Date(solicitudValidated.fecha) : solicitud.fecha,
          descripcion: solicitudValidated.descripcion ?? solicitud.descripcion,
          estado: solicitudValidated.estado ?? solicitud.estado,
          cliente_id: solicitudValidated.cliente_id ?? solicitud.cliente_id,
          tecnico_id: solicitudValidated.tecnico_id ?? solicitud.tecnico_id
        }
      });

      return { solicitud: updatedSolicitud, status: 200 };

    } catch (error) {
      console.log(error);
      return {
        error: 'Solicitud update failed',
        status: 500
      };
    }
  }

  static async deleteSolicitud (id: number) {
    try {
      const solicitud = await prisma.solicitud.findUnique({
        where: {
          id
        }
      });

      if (!solicitud) {
        return {
          error: 'Solicitud not found',
          status: 404
        };
      }

      await prisma.solicitud_Product.deleteMany({
        where: {
          solicitud_id: id
        }
      });

      await prisma.solicitud.delete({
        where: {
          id
        }
      });      

      return { message: 'Solicitud deleted', status: 200 };

    } catch (error) {
      console.log(error);
      return {
        error: 'Solicitud delete failed',
        status: 500
      };
    }
  }

  static async generateSolicitudPdf(id: number) {
    try {
      const solicitud = await SolicitudService.getSolicitudDetails(id);
      
      if ('error' in solicitud) {
        return solicitud;
      }

      const date = new Date(solicitud.fecha);
      const fomattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      
      const doc = new PDFDocument({
        margins: {top: 50, bottom: 50, left: 50, right: 50},
        size: 'A4'
      });
      const buffers: Buffer[] = [];
      
      doc.on('data', (chunk) => buffers.push(chunk));
      
      doc.fontSize(18).font('Helvetica-Bold').text('EPCO IDEAS', {align: 'center'});
      doc.moveDown(0.5);
      
      doc.rect(50, doc.y, 495, 60).stroke('#d1d1d1');
      doc.fontSize(16).font('Helvetica-Bold').text('Detalles de Solicitud', 70, doc.y + 15);
      doc.fontSize(12).font('Helvetica').text(`N° ${id}`, 70, doc.y + 5);
      doc.moveDown(2.5);
      
      const startY = doc.y;
      
      const addSection = (title: string, content: string | string[]) => {
        doc.fontSize(11).font('Helvetica-Bold').text(title);
        doc.fontSize(11).font('Helvetica');
        
        if (Array.isArray(content)) {
          content.forEach((item, index) => {
            doc.text(`• ${item}`, {indent: 10});
          });
        } else {
          doc.text(content);
        }
        doc.moveDown(0.5);
      };
      
      addSection('Título', solicitud.title);
      addSection('Cliente', solicitud.cliente_nombre);
      
      doc.fontSize(11).font('Helvetica-Bold').text('Celular', {continued: true, width: 450});
      doc.text('Fecha', {align: 'right'});
      doc.fontSize(11).font('Helvetica').text(solicitud.cliente_celular, {continued: true, width: 450});
      doc.text(fomattedDate, {align: 'right'});
      doc.moveDown(1);
      
      addSection('Productos', solicitud.productos_nombres);
      
      addSection('Descripción', solicitud.descripcion);
      
      addSection('Estado', solicitud.estado);
      
      addSection('Equipo de trabajo', solicitud.tecnico_nombre);
      
      doc.lineWidth(1).rect(50, startY - 10, 495, doc.y - startY + 20).stroke('#d1d1d1');
      
      doc.fontSize(10).font('Helvetica').text('Documento generado automáticamente', 50, 750);
      doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 50);

      doc.end();
      
      return new Promise<{ pdf: Buffer, status: number } | { error: string, status: number }>((resolve) => {
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve({ pdf: pdfData, status: 200 });
        });
      });
    } catch (error) {
      console.log(error);
      return { error: 'Failed to generate PDF', status: 500 };
    }
  }
}