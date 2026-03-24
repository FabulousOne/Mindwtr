import { describe, expect, it } from 'vitest';
import { buildMultipartAudioPart, loadModuleFromCandidates } from './speech-to-text.helpers';

describe('speech-to-text helpers', () => {
  it('builds a blob-backed multipart part when bytes are available', async () => {
    const bytes = new Uint8Array([1, 2, 3, 4]);
    const { part, fileName } = buildMultipartAudioPart({
      uri: 'file:///tmp/clip.m4a',
      name: 'clip.m4a',
      type: 'audio/mp4',
      bytes,
    });

    expect(part).toBeInstanceOf(Blob);
    expect(fileName).toBe('clip.m4a');
    await expect((part as Blob).arrayBuffer()).resolves.toBeInstanceOf(ArrayBuffer);
  });

  it('falls back to the React Native uri part when bytes are unavailable', () => {
    const { part, fileName } = buildMultipartAudioPart({
      uri: 'file:///tmp/clip.m4a',
      name: 'clip.m4a',
      type: 'audio/mp4',
      bytes: null,
    });

    expect(part).toEqual({
      uri: 'file:///tmp/clip.m4a',
      name: 'clip.m4a',
      type: 'audio/mp4',
    });
    expect(fileName).toBeUndefined();
  });

  it('loads the first working module candidate', () => {
    const seen: string[] = [];
    const loaded = loadModuleFromCandidates(['first', 'second', 'third'], (candidate) => {
      seen.push(candidate);
      if (candidate === 'third') {
        return { ok: true };
      }
      throw new Error(`missing ${candidate}`);
    });

    expect(loaded).toEqual({
      candidate: 'third',
      module: { ok: true },
    });
    expect(seen).toEqual(['first', 'second', 'third']);
  });

  it('rethrows the last module load error when all candidates fail', () => {
    expect(() =>
      loadModuleFromCandidates(['first', 'second'], (candidate) => {
        throw new Error(`missing ${candidate}`);
      })
    ).toThrow('missing second');
  });
});
