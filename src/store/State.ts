import {ValidationError} from '@/store/errors'
import {Palette} from '@/models/Palette'
import {Level} from '@/models/Level'
import {Colormap} from '@/models/Colormap'

export interface State {
  errors: ValidationError[];

  showLevelsDialog: boolean;
  palette: Palette;

  showScaleDialog: boolean;
  scaleMin: number;
  scaleMax: number;
  scaleInterval: number;
  isScaleLines: boolean;
  isScaleFilling: boolean;

  showLineDialog: boolean;
  editableLevelLine: Level;

  showColormapDialog: boolean;
  colormap: Colormap;
  colormapPresets: any[];
}