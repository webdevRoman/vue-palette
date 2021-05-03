import {ValidationError} from '@/store/errors'
import {Palette} from '@/models/Palette'
import {Level} from '@/models/Level'
import {SliderDot} from '@/models/SliderDot'

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
  sliderDots: SliderDot[];
}