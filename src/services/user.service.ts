import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { AdminRegisterSchema, ClienteRegisterSchema, PublicUserSchema, TecnicoSchema, CreateTecnicoSchema, UpdateTecnicoSchema } from "../schemas/user.schema";
import prisma from "../utils/connection";
import bcrypt from 'bcrypt';

export class UserService {
  static async getAllUsers() {
    try {
      const users = await prisma.user.findMany();
      return { users: users.map(user => PublicUserSchema.parse(user)), status: 200 };
    } catch (error) {
      console.log(error);
      return { error: 'something went wrong :(', status: 500 };
    }
  };

  //solo para crear admins
  static register = async (userData: Object) => {
    const result = AdminRegisterSchema.safeParse(userData);
    if (!result.success) {
      return { user: null, error: result.error.errors, status: 400 };
    }
    const { email, nombres, apellidos, dni, password, fecha_nac } = result.data;
    const hashed_pasword = await bcrypt.hash(password, 10);
    try {
      //search another user with the same email

      const newUser = await prisma.user.create({
        data: {
          email,
          nombres,
          apellidos,
          dni,
          hashed_pasword,
          fecha_nac,
          role: 'admin' //me olvide el rol xde
        }
      })
      PublicUserSchema.parse(newUser);
      return { user: newUser, status: 201 };
    } catch (error) {
      console.log(error);
      console.log('wasa');
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        return { error: 'Email already exists', status: 400 };
      }
      console.log(error);
      return { error: 'something went wrong :(', status: 500 };
    }
  }


  static registerCliente = async (userData: Object) => {
    const result = ClienteRegisterSchema.safeParse(userData);
    if (!result.success) {
      return {
        user: null, error: result.error.errors, status: 400
      };
    }
    const { email, nombres, apellidos, dni, fecha_nac, direccion, telefono } = result.data;
    try {
      const newCliente = await prisma.user.create({
        data: {
          email,
          nombres,
          apellidos,
          dni,
          fecha_nac,
          direccion,
          telefono,
          role: 'cliente',
          hashed_pasword: await bcrypt.hash('12345678', 10) //No necesaria contraseña para un cliente (no es usuario)
        }
      });
      PublicUserSchema.parse(newCliente);
      return {
        user: newCliente, status: 201
      };

    } catch (error) {
      console.log(error);
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        return {
          error: 'Email or DNI already exists', status: 400
        };
      }

      return { error: 'Error al registrar cliente', status: 500 };
    }

  }

  static getAllClientes = async () => {
    try {
      const clientes = await prisma.user.findMany({
        where: {
          role: 'cliente'
        }
      });
      return {
        clientes: clientes.map(cliente => PublicUserSchema.parse(cliente)), status: 200
      };
    } catch (error) {
      console.log(error);
      return { error: 'something went wrong :(', status: 500 };
    }
  }

  static getAllNombresTecnicos = async () => {
    try {
      const tecnicos = await prisma.user.findMany({
        where: {
          role: 'tecnico'
        }
      });
      return {
        tecnicos: tecnicos.map(tecnico => ({
          id: tecnico.id,
          nombreCompleto: tecnico.nombres + ' ' + tecnico.apellidos
        })),
        status: 200
      };
    } catch (error) {
      console.log(error);
      return { error: 'something went wrong :(', status: 500 };
    }
  }

  static async getAllTecnicos() {
    try {
      const tecnicos = await prisma.user.findMany({
        where: {
          role: 'tecnico'
        }
      });
      return {
        tecnicos: tecnicos.map(tecnico => TecnicoSchema.parse(tecnico)), status: 200
      };
    } catch (error) {
      console.log(error);
      return { error: 'something went wrong :(', status: 500 };
    }
  }

  static async getTecnicoById(id: number) {
    try {
      const tecnico = await prisma.user.findUnique({
        where: {
          id
        }
      });
      if (!tecnico) {
        return { error: 'Tecnico not found', status: 404 };
      }
      return {
        tecnico: TecnicoSchema.parse(tecnico), status: 200
      };
    } catch (error) {
      console.log(error);
      return { error: 'something went wrong :(', status: 500 };
    }
  }

  static async createTecnico(tecnicoData: Object) {
    const result = CreateTecnicoSchema.safeParse(tecnicoData);
    if (!result.success) {
      return {
        tecnico: null, error: result.error.errors, status: 400
      };
    } else {
      const { email, nombres, apellidos, dni, telefono, fecha_nac } = result.data;
      try {
        const newTecnico = await prisma.user.create({
          data: {
            email,
            nombres,
            apellidos,
            dni,
            telefono,
            fecha_nac,
            role: 'tecnico',
            disponibilidad: "activo",
            hashed_pasword: await bcrypt.hash('tecnicopass', 10)
          }
        });
        return {
          tecnico: TecnicoSchema.parse(newTecnico), status: 201
        };
      } catch (error) {
        console.log(error);
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
          return {
            error: 'Email or DNI already exists', status: 400
          };
        }
        return { error: 'Error al registrar tecnico', status: 500 };
      }
    }
  }

  static async updateTecnico(id: number, tecnicoData: Object) {
    const tecnico = await prisma.user.findUnique({ where: { id } });
    if (!tecnico) {
      return { error: 'Tecnico not found', status: 404 };
    }
    const result = UpdateTecnicoSchema.safeParse(tecnicoData);
    if (!result.success) {
      return {
        tecnico: null, error: result.error.errors, status: 400
      };
    } else {
      try {
        const updatedTecnico = await prisma.user.update({
          where: { id }, data: {
            nombres: result.data.nombres ?? tecnico.nombres,
            apellidos: result.data.apellidos ?? tecnico.apellidos,
            email: result.data.email ?? tecnico.email,
            dni: result.data.dni ?? tecnico.dni,
            telefono: result.data.telefono ?? tecnico.telefono,
            fecha_nac: result.data.fecha_nac ?? tecnico.fecha_nac
          }
        });
        return {
          tecnico: TecnicoSchema.parse(updatedTecnico), status: 200
        };
      } catch (error) {
        console.log(error);
        return { error: 'something went wrong :(', status: 500 };
      }
    }
  }

  static async deleteTecnico(id: number) {
    try {
      await prisma.user.delete({ where: { id } });
      return { message: 'Tecnico deleted', status: 204 };
    } catch (error) {
      console.log(error);
      return { error: 'something went wrong :(', status: 500 };
    }
  }
}
