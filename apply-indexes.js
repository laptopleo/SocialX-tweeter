// Script para aplicar índices a la base de datos
require("dotenv").config({ path: ".env.local" });
require("dotenv").config({ path: ".env" });

const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

// Verificar que DATABASE_URL esté disponible
if (!process.env.DATABASE_URL) {
  console.error("❌ ERROR: DATABASE_URL no está definida");
  console.error("   Asegúrate de tener .env.local o .env con DATABASE_URL");
  process.exit(1);
}

const prisma = new PrismaClient();

async function applyIndexes() {
  try {
    console.log("📊 Aplicando índices a la base de datos...\n");

    const sqlPath = path.join(__dirname, "prisma", "migrations", "add_indexes.sql");
    const sql = fs.readFileSync(sqlPath, "utf-8");

    // Dividir por líneas y ejecutar cada CREATE INDEX
    const statements = sql
      .split("\n")
      .filter((line) => line.trim().startsWith("CREATE INDEX"))
      .map((line) => line.trim());

    console.log(`✓ Encontrados ${statements.length} índices para crear\n`);

    for (const statement of statements) {
      const indexName = statement.match(/idx_\w+/)?.[0];
      try {
        await prisma.$executeRawUnsafe(statement);
        console.log(`✓ ${indexName} creado`);
      } catch (error) {
        if (error.message.includes("already exists")) {
          console.log(`⚠ ${indexName} ya existe (ok)`);
        } else {
          console.error(`❌ Error en ${indexName}:`, error.message);
        }
      }
    }

    console.log("\n✅ Índices aplicados correctamente");

    // Verificar índices creados
    console.log("\n📋 Verificando índices en la base de datos...");
    const indexes = await prisma.$queryRaw`
      SELECT 
        schemaname,
        tablename,
        indexname
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND indexname LIKE 'idx_%'
      ORDER BY tablename, indexname;
    `;

    console.log("\n✓ Índices activos:");
    indexes.forEach((idx) => {
      console.log(`  - ${idx.tablename}.${idx.indexname}`);
    });
  } catch (error) {
    console.error("❌ Error aplicando índices:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

applyIndexes();
