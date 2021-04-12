import {Palette} from '@/models/Palette'
import {Level} from '@/models/Level'

export interface State {
  showLevelsDialog: boolean;
  palette: Palette;
  editableLevel: Level;
}