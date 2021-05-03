<template>
  <Dialog class="dialog-colormap dialog-xl" header="Редактирование цветовой карты" v-model:visible="showColormapDialog"
          modal :closeOnEscape="false">

    <Panel header="Выбор из готовых вариантов" class="colormap-presets">

    </Panel>

    <Panel header="Редактирование цветовой карты" class="colormap">
      <div class="flex flex-sb slider-inputs">
        <div class="slider-input">
          <span class="p-float-label">
            <InputNumber id="value" v-model="value" :disabled="!focusedSlider"
                         @focusout="setSliderValue" @keypress.enter="setSliderValue"
                         :minFractionDigits="2" :maxFractionDigits="2"/>
            <label for="value">Значение</label>
          </span>
        </div>
        <div class="slider-input">
          <span class="p-float-label">
            <InputNumber id="position" v-model="position" :disabled="!focusedSlider"
                         @focusout="setSliderPerCentValue" @keypress.enter="setSliderPerCentValue"
                         :minFractionDigits="2" :maxFractionDigits="2" suffix="%" :min="0" :max="100"/>
            <label for="position">Позиция</label>
          </span>
        </div>
        <div>
          <label class="label">Цвет линии</label>
          <ColorPicker v-model="color" format="rgb" :disabled="!focusedSlider" class="cell"/>
        </div>
      </div>

      <vue-slider
          ref="slider"
          v-model="sliderValues"
          :data="sliders"
          :data-value="'value'"
          :min="sliderMin"
          :max="sliderMax"
          :order="false"
          :process="false"
          :clickable="false"
          :tooltip="'none'"
          @drag-start="onDragStart($event)"
          @drag-end="onDragEnd($event)"
          @dragging="onDragging($event)">
        <template #dot="{value, index}">
          <div :class="['slider-dot', { 'slider-dot_focus': focusedSlider ? value === focusedSlider.value : false }]"
               :style="getDotStyle(index)">
            <div class="slider-dot__shadow" :style="getDotShadowStyle(index)"></div>
          </div>
        </template>
      </vue-slider>
    </Panel>

    <Button label="Применить" @click="applyColormap"/>

  </Dialog>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {SliderDot} from '@/models/SliderDot'
import {Color} from '@/models/Color'

const recountPerCentValues = (sliders: SliderDot[]) => {
  let sliderMin = sliders[0].value
  let sliderMax = sliders[0].value
  for (let i = 1; i < sliders.length; i++) {
    if (sliders[i].value < sliderMin) {
      sliderMin = sliders[i].value
    }
    if (sliders[i].value > sliderMax) {
      sliderMax = sliders[i].value
    }
  }
  sliders.forEach(slider => slider.perCentValue = (slider.value - sliderMin) / (sliderMax - sliderMin) * 100)
}

export default defineComponent({

  name: 'ColormapDialog',

  data() {
    return {
      showColormapDialog: false,
      sliders: null as SliderDot[],
      sliderValues: null,
      sliderMin: null,
      sliderMax: null,
      focusedSlider: null as SliderDot,
      value: null,
      position: null,
      color: null,
      focusedSliderIndex: null
    }
  },

  methods: {
    setSliderValue() {
      this.focusedSlider.value = this.sliderValues[this.focusedSliderIndex] = this.value;
      if (this.value < this.sliderMin || this.value > this.sliderMax) {
        if (this.value < this.sliderMin) {
          this.sliderMin = this.value
        } else {
          this.sliderMax = this.value
        }
        recountPerCentValues(this.sliders)
      } else {
        this.focusedSlider.perCentValue = (this.value - this.sliderMin) / (this.sliderMax - this.sliderMin) * 100
      }
      (this.$refs.slider as any).setValue(this.sliderValues)
      this.position = this.focusedSlider.perCentValue
    },

    setSliderPerCentValue() {
      this.focusedSlider.perCentValue = this.position
      this.focusedSlider.value = this.sliderValues[this.focusedSliderIndex] = this.value =
          this.sliderMin + (this.sliderMax - this.sliderMin) * this.position / 100;
      (this.$refs.slider as any).setValue(this.sliderValues)
    },

    onDragStart(event: any) {
      this.focusedSliderIndex = event
      this.focusedSlider = this.sliders[event]
      this.value = this.focusedSlider.value
      this.position = this.focusedSlider.perCentValue
      this.color = this.focusedSlider.color.rgbObj
    },

    onDragging(event: any) {
      this.value = event[this.focusedSliderIndex]
      this.position = (this.value - this.sliderMin) / (this.sliderMax - this.sliderMin) * 100
    },

    onDragEnd(event: any) {
      this.sliders[event].value = this.sliderValues[event]
      this.sliders[event].perCentValue = (this.sliderValues[event] - this.sliderMin) /
          (this.sliderMax - this.sliderMin) * 100
    },

    getDotStyle(index: number) {
      return `background-color: ${this.sliders[index]?.color.rgb}`
    },

    getDotShadowStyle(index: number) {
      const color: Color = this.sliders[index]?.color
      return `background-color: rgba(${color.rgbObj.r}, ${color.rgbObj.g}, ${color.rgbObj.b}, 0.38)`
    },

    applyColormap() {
      // console.log('apply');
      // (this.$refs.slider as any).focus(1)
    }
  },

  computed: {
    showStoreColormapDialog(): boolean {
      return this.$store.getters.showColormapDialog
    },

    storeSliders(): SliderDot[] {
      return this.$store.getters.sliders
    }
  },

  watch: {
    showStoreColormapDialog(value) {
      this.showColormapDialog = value
    },

    showColormapDialog(value) {
      if (!value) {
        this.$store.dispatch('HIDE_COLORMAP_DIALOG')
      }
    },

    storeSliders(value: SliderDot[]) {
      if (value) {
        this.sliders = [...value]
        this.sliderValues = this.sliders?.map(slider => slider.value)
        this.sliderMin = this.sliders[0].value
        this.sliderMax = this.sliders[this.sliders?.length - 1].value
      }
    },

    color(value: any) {
      if (value && this.focusedSlider) {
        this.focusedSlider.color = new Color(`RGB(${value.r}, ${value.g}, ${value.b})`)
      }
    }
  }
})
</script>

<style scoped lang="stylus">
//@import '../assets/styles/vars'
.slider
  &-inputs
    margin-bottom 20px
  &-input
    margin-top 20px

  &-dot
    position relative
    width 100%
    height 100%
    border-radius 50%
    box-shadow 0 0 8px rgba(#000, 0.75)
    cursor pointer
    transition all .3s
    &__shadow
      position absolute
      left 50%
      top 50%
      width 200%
      height 200%
      border-radius 50%
      transform translate(-50%, -50%) scale(0)
      z-index -1
      transition transform 0.2s
    &_focus .slider-dot__shadow
      transform translate(-50%, -50%) scale(1)
</style>