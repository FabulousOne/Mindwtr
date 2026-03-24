export type MultipartAudioFallbackPart = {
  uri: string;
  name: string;
  type: string;
};

export type MultipartAudioPart = Blob | MultipartAudioFallbackPart;

export const buildMultipartAudioPart = ({
  uri,
  name,
  type,
  bytes,
}: {
  uri: string;
  name: string;
  type: string;
  bytes?: Uint8Array | null;
}): { part: MultipartAudioPart; fileName?: string } => {
  const BlobCtor = globalThis.Blob;
  if (bytes && bytes.byteLength > 0 && typeof BlobCtor === 'function') {
    try {
      return {
        part: new BlobCtor([bytes], { type }),
        fileName: name,
      };
    } catch {
      // Fall through to the React Native uri object below.
    }
  }

  return {
    part: { uri, name, type },
  };
};

export const loadModuleFromCandidates = <T>(
  candidates: readonly string[],
  load: (candidate: string) => T
): { candidate: string; module: T } => {
  let lastError: unknown = new Error('No module candidates provided.');
  for (const candidate of candidates) {
    try {
      return {
        candidate,
        module: load(candidate),
      };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
};
