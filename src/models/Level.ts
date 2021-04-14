import {LineStyles} from '@/models/LineStyles'
import {Color} from '@/models/Color'

export interface Level {
  id: number;
  value: number;
  lineStyle: LineStyles;
  lineWidth: number;
  lineColor: Color;
  fillColor: Color;
}