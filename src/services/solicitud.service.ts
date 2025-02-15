import { SolicitudCreatedSchema, SolicitudDetailsSchema, SolicitudTableSchema, SolicitudUpdateSchema } from "../schemas/solicitud.schema";
import prisma from "../utils/connection";
import { UserService } from "./user.service";

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
        productos_nombres: solicitud.Solicitud_Product.map(sp => sp.product.name),
        estado: solicitud.estado,
        tecnico_nombre: solicitud.tecnico.nombres + ' ' + solicitud.tecnico.apellidos
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
}