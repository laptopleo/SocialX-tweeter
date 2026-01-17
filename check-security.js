// 🔒 Script para verificar configuración de seguridad
const fs = require("fs");
const path = require("path");

console.log("🔒 Verificando configuración de seguridad...\n");

let hasIssues = false;

// 1. Verificar .gitignore
console.log("📋 Verificando .gitignore...");
const gitignorePath = path.join(__dirname, ".gitignore");
if (fs.existsSync(gitignorePath)) {
  const gitignore = fs.readFileSync(gitignorePath, "utf-8");
  const requiredEntries = [".env", ".env.local", ".env.*.local"];

  requiredEntries.forEach((entry) => {
    if (gitignore.includes(entry)) {
      console.log(`  ✓ ${entry} está en .gitignore`);
    } else {
      console.log(`  ❌ ${entry} NO está en .gitignore`);
      hasIssues = true;
    }
  });
} else {
  console.log("  ⚠️ .gitignore no encontrado");
  hasIssues = true;
}

// 2. Verificar que .env.local NO esté commiteado
console.log("\n📋 Verificando archivos sensibles...");
const { execSync } = require("child_process");
try {
  const trackedFiles = execSync("git ls-files", { encoding: "utf-8" });

  if (trackedFiles.includes(".env.local")) {
    console.log("  ❌ .env.local está commiteado en Git (CRÍTICO)");
    console.log("     Ejecuta: git rm --cached .env.local");
    hasIssues = true;
  } else {
    console.log("  ✓ .env.local NO está commiteado");
  }

  if (trackedFiles.includes(".env")) {
    console.log("  ⚠️ .env está commiteado (puede contener secretos)");
    hasIssues = true;
  } else {
    console.log("  ✓ .env NO está commiteado");
  }
} catch (error) {
  console.log("  ⚠️ No se pudo verificar Git (¿no es un repositorio?)");
}

// 3. Verificar que .env.example existe
console.log("\n📋 Verificando .env.example...");
const envExamplePath = path.join(__dirname, ".env.example");
if (fs.existsSync(envExamplePath)) {
  console.log("  ✓ .env.example existe");

  // Verificar que no tenga valores reales
  const envExample = fs.readFileSync(envExamplePath, "utf-8");
  const suspiciousPatterns = [
    /sk_test_\w{99}/, // Stripe test key
    /sk_live_\w{99}/, // Stripe live key
    /AIza[0-9A-Za-z-_]{35}/, // Google API key
    /postgresql:\/\/[^:]+:[^@]+@/, // Database URL con password
  ];

  let hasSuspicious = false;
  suspiciousPatterns.forEach((pattern) => {
    if (pattern.test(envExample)) {
      hasSuspicious = true;
    }
  });

  if (hasSuspicious) {
    console.log("  ⚠️ .env.example parece contener valores reales");
    hasIssues = true;
  } else {
    console.log("  ✓ .env.example no contiene valores reales");
  }
} else {
  console.log("  ⚠️ .env.example no existe (recomendado para documentación)");
}

// 4. Verificar archivos de seguridad
console.log("\n📋 Verificando archivos de seguridad...");
const securityFiles = ["lib/rate-limit.ts", "SECURITY-AUDIT.md"];

securityFiles.forEach((file) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✓ ${file} existe`);
  } else {
    console.log(`  ⚠️ ${file} no encontrado`);
  }
});

// 5. Verificar variables de entorno requeridas
console.log("\n📋 Verificando variables de entorno...");
const requiredEnvVars = ["DATABASE_URL", "AUTH_SECRET", "STRIPE_API_KEY", "STRIPE_WEBHOOK_SECRET"];

const envLocalPath = path.join(__dirname, ".env.local");
if (fs.existsSync(envLocalPath)) {
  const envLocal = fs.readFileSync(envLocalPath, "utf-8");

  requiredEnvVars.forEach((varName) => {
    if (envLocal.includes(`${varName}=`)) {
      console.log(`  ✓ ${varName} está definida`);
    } else {
      console.log(`  ⚠️ ${varName} no está definida`);
    }
  });
} else {
  console.log("  ⚠️ .env.local no existe");
}

// Resumen
console.log("\n" + "=".repeat(50));
if (hasIssues) {
  console.log("❌ Se encontraron problemas de seguridad");
  console.log("\n📖 Lee SECURITY-AUDIT.md para más detalles");
  process.exit(1);
} else {
  console.log("✅ Configuración de seguridad correcta");
  console.log("\n💡 Recuerda rotar credenciales si fueron expuestas");
  process.exit(0);
}
