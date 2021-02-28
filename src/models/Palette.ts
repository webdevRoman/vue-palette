import {Level} from '@/models/Level'

export interface Palette {
  type: string;
  levels: Level[];
  fileText: string;
}