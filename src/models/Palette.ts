import {Level} from '@/models/Level'
import {ColormapTypes} from '@/models/ColormapTypes'
import {ColormapPresets} from '@/models/ColormapPresets'

export interface Palette {
  linesColormapType: ColormapTypes;
  linesColormapPreset: ColormapPresets;
  fillingColormapType: ColormapTypes;
  fillingColormapPreset: ColormapPresets;
  levels: Level[];
  fileText: string;
}