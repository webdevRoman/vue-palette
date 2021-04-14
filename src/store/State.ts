import {ValidationError} from '@/store/errors'
import {Palette} from '@/models/Palette'
import {Level} from '@/models/Level'

export interface State {
  errors: ValidationError[];
  showLevelsDialog: boolean;
  palette: Palette;
  editableLevel: Level;
  showScaleDialog: boolean;
  scaleMin: number;
  scaleMax: number;
  scaleInterval: number;
}