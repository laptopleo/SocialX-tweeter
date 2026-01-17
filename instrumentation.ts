// instrumentation.ts (en la raíz)
export async function register() {
  // ⚡ CAMBIO: Desactiva la instrumentación de logs innecesarios que vimos en el heap profile
  instrumentationHook: false;
}
