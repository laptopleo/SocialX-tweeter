// eslint.config.mjs
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = defineConfig([
  ...nextVitals,
  // Ignorar archivos generados y de configuración
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'node_modules/**',
    '*.config.*',
  ]),
  // Reglas personalizadas (opcional)
  {
    rules: {
      '@next/next/no-img-element': 'off', // Ejemplo: desactiva regla específica
    },
  },
]);

export default eslintConfig;