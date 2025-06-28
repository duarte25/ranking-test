export function convertBytesToImageUrl(byteArray: Record<number, number> | Uint8Array | undefined) {
  if (!byteArray) return null;

  // Se já for um Uint8Array, usa diretamente, senão converte
  const uint8Array = byteArray instanceof Uint8Array ? byteArray : new Uint8Array(Object.values(byteArray));

  const blob = new Blob([uint8Array], { type: "image/jpeg" }); // Ajuste o tipo conforme necessário
  return URL.createObjectURL(blob);
}