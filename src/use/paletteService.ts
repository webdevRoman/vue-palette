import {ref, Ref} from 'vue'
import {Palette} from '@/models/Palette'
import {LineStyles} from '@/models/LineStyles'
import {Color} from '@/models/Color'
import {Level} from '@/models/Level'

export function usePaletteService(): any {
  const palette: Ref<Palette> = ref<Palette>()

  const readPaletteFromFile = async (file: File): Promise<void> => {
    const fileText: string = await file.text()
    const fileTextLines: string[] = fileText.split('\n')
    const levelsLines: string[] = [...fileTextLines]
    levelsLines.shift()
    levelsLines.shift()

    palette.value = {
      type: fileTextLines[0],
      levels: [],
      fileText: fileText
    } as Palette

    levelsLines.forEach(line => {
      const levelFields: string[] = line.split(' ')
      palette.value.levels.push({
        value: parseInt(levelFields[0]),
        lineStyle: Object.keys(LineStyles).find(it => it === levelFields[1].toUpperCase()),
        lineWidth: parseInt(levelFields[2]),
        lineColor: new Color(levelFields[3]),
        fillColor: new Color(levelFields[4])
      } as Level)
    })
  }

  return { palette, readPaletteFromFile }
}