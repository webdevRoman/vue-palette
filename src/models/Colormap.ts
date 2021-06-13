import {SliderDot} from '@/models/SliderDot'
import {ColormapTypes} from '@/models/ColormapTypes'
import {ColormapPresets} from '@/models/ColormapPresets'

export interface Colormap {
  type: ColormapTypes;
  preset: ColormapPresets;
  sliderDots: SliderDot[];
}