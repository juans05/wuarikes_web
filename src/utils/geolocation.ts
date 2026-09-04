export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Tu navegador no soporta ubicación."));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10_000,
    });
  });
}

export function locationErrorMessage(err: unknown): string {
  if (err instanceof GeolocationPositionError) {
    if (err.code === err.PERMISSION_DENIED) {
      return "Necesitamos tu ubicación para confirmar que estás en el local. Actívala en los permisos del navegador.";
    }
    return "No pudimos obtener tu ubicación. Intenta de nuevo con el GPS activado.";
  }
  return err instanceof Error ? err.message : "No pudimos obtener tu ubicación.";
}
