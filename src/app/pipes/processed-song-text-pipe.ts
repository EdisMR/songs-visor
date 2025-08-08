import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transpose',
  standalone: false
})
export class ProcessedSongTextPipe implements PipeTransform {

  private readonly NOTES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  private readonly FLAT_EQUIV: { [key: string]: string } = {
    'C#': 'Db',
    'D#': 'Eb',
    'F#': 'Gb',
    'G#': 'Ab',
    'A#': 'Bb'
  };

  transform(text: string, steps: number, useFlats: boolean = false): string {
    if (!text || typeof text !== 'string') return text;

    return text.replace(/\[([^\]]+)\]/g, (_, chord: string) => {
      const transposed = this.transposeChord(chord, steps, useFlats);
      return `[${transposed}]`;
    });
  }

  // Transpone un acorde individual
  private transposeChord(chord: string, steps: number, useFlats: boolean): string {
    const match = chord.match(/^([A-G]{1}[#b]?)(.*)$/);
    if (!match) return chord;

    const [, root, suffix] = match;

    // Normaliza bemoles a sostenidos para facilitar búsqueda
    const normalizedRoot = root
      .replace('Db', 'C#')
      .replace('Eb', 'D#')
      .replace('Gb', 'F#')
      .replace('Ab', 'G#')
      .replace('Bb', 'A#');

    const index = this.NOTES_SHARP.indexOf(normalizedRoot);
    if (index === -1) return chord;

    const newIndex = (index + steps + 12) % 12;
    let newRoot = this.NOTES_SHARP[newIndex];

    // Convierte a bemol si se solicitó
    if (useFlats && this.FLAT_EQUIV[newRoot]) {
      newRoot = this.FLAT_EQUIV[newRoot];
    }

    return newRoot + suffix;
  }

}
