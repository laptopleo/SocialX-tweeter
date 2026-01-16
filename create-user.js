// Script para crear usuario en la base de datos
// Ejecutar con: node create-user.js

require("dotenv").config({ path: ".env.local" });

const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createUser() {
  try {
    // Datos del usuario
    const email = "leonardo558@gmail.com";
    const password = "25252525";
    const name = "Leonardo";
    const username = "leonardo558";

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔐 Contraseña hasheada:", hashedPassword);

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("⚠️  Usuario ya existe con ese email");
      console.log("Usuario existente:", {
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        username: existingUser.username,
      });
      return;
    }

    // Crear el usuario
    const user = await prisma.user.create({
      data: {
        email,
        name,
        username,
        hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("✅ Usuario creado exitosamente:");
    console.log({
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("❌ Error al crear usuario:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();
