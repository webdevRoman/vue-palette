import {LineStyles} from '@/models/LineStyles'
import {Color} from '@/models/Color'

export interface Level {
  value: number;
  lineStyle: LineStyles;
  lineWidth: number;
  lineColor: Color;
  fillColor: Color;
  editValue: boolean;
  wrongValue: boolean;
}