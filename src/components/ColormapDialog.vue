<template>
  <Dialog class="dialog-colormap dialog-xl" header="Редактирование цветовой карты" v-model:visible="showColormapDialog"
          modal maximizable :closeOnEscape="false" @hide="dropFocusedSliderDot()">

    <Panel header="Выбор из готовых вариантов" class="colormap-panel colormap-presets">
      <span class="p-float-label colormap-preset">
        <Dropdown id="colormap-preset" class="colormap-preset__dropdown" placeholder="Готовый вариант"
                  v-model="colormapPreset" :options="storeColormapPresets" @change="changePreset($event)">
          <template #value="slotProps">
            <div class="flex colormap-preset__option" v-if="slotProps.value">
              <div class="flex-50 colormap-preset__gradient" :style="slotProps.value.gradientStyle"></div>
              <div class="flex-50 colormap-preset__name">{{ slotProps.value.preset }}</div>
            </div>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
          <template #option="slotProps">
            <div class="flex colormap-preset__option">
              <div class="flex-50 colormap-preset__gradient" :style="slotProps.option.gradientStyle"></div>
              <div class="flex-50 colormap-preset__name">{{ slotProps.option.preset }}</div>
            </div>
          </template>
        </Dropdown>
        <label for="colormap-preset">Готовый вариант</label>
      </span>
    </Panel>

    <Panel header="Редактирование цветовой карты" class="colormap-panel colormap">
      <div class="flex flex-sb slider-controls">
        <div class="flex-50 flex flex-sb slider-inputs">
          <div class="slider-controls__line flex">
            <div class="slider-input dot-value">
              <span class="p-float-label">
                <InputNumber id="value" v-model="value" :disabled="!focusedSliderDot"
                             @focusout="setSliderDotValue()" @keypress.enter="setSliderDotValue()"
                             :minFractionDigits="2" :maxFractionDigits="2"/>
                <label for="value">Значение</label>
              </span>
            </div>
            <div class="slider-input">
              <span class="p-float-label">
                <InputNumber id="position" v-model="position" :disabled="!focusedSliderDot"
                             @focusout="setSliderDotPerCentValue()" @keypress.enter="setSliderDotPerCentValue()"
                             :minFractionDigits="2" :maxFractionDigits="2" suffix="%" :min="0" :max="100"/>
                <label for="position">Позиция</label>
              </span>
            </div>
          </div>
          <div class="dot-color">
            <label class="label">Цвет</label>
            <ColorPicker v-model="color" format="rgb" :disabled="!focusedSliderDot" class="cell"/>
          </div>
        </div>

        <div class="flex-25 flex flex-sb slider-btns">
          <Button class="slider-btn" label="Добавить точку" @click="addSliderDot()"/>
          <Button class="slider-btn" label="Удалить точку" @click="deleteSliderDot()" :disabled="!focusedSliderDot"/>
        </div>

        <Divider layout="vertical"/>

        <div class="flex-25 flex flex-sb slider-btns">
          <span class="p-float-label slider-btn">
            <Dropdown id="colormap-type" v-model="colormapType" :options="colormapTypes"/>
            <label for="colormap-type">Тип цветовой карты</label>
          </span>
          <Button class="slider-btn" label="Инвертировать" @click="invertSlider()"/>
        </div>
      </div>

      <vue-slider
          :class="[{ 'slider-deleting': isDotsTransitionStopped }]"
          ref="slider"
          v-model="sliderDotsValues"
          :data="sliderDots"
          :data-value="'value'"
          :min="sliderMinValue"
          :max="sliderMaxValue"
          :order="false"
          :process="false"
          :clickable="false"
          :tooltip="'none'"
          :contained="true"
          @drag-start="onDragStart($event)"
          @dragging="onDragging($event)">
        <template #dot="{value, index}">
          <div :style="getDotStyle(index)"
               :class="['slider-dot', { 'slider-dot_focus': focusedSliderDot ? value === focusedSliderDot.value : false }]">
            <div class="slider-dot__shadow" :style="getDotShadowStyle(index)"></div>
          </div>
        </template>
      </vue-slider>

      <div class="gradient" :style="getGradientStyle()"></div>
    </Panel>

    <div class="flex colormap-apply">
      <Button label="Применить" @click="applyColormap()"/>
    </div>

  </Dialog>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {countPerCent, countValue} from '@/store/scale'
import {getGradientStyle} from '@/store/colormap'
import {SliderDot} from '@/models/SliderDot'
import {Color} from '@/models/Color'
import {ColormapTypes} from '@/models/ColormapTypes'
import {Palette} from '@/models/Palette'
import {Colormap} from '@/models/Colormap'
import {ColormapPresets} from '@/models/ColormapPresets'

export default defineComponent({

  name: 'ColormapDialog',

  data() {
    return {
      showColormapDialog: false,

      colormapType: null,
      colormapTypes: Object.values(ColormapTypes),
      colormapPreset: null,
      colormapPresetsNames: Object.values(ColormapPresets),

      sliderDots: null as SliderDot[],
      sliderDotsValues: null,
      sliderMinValue: null,
      sliderMaxValue: null,
      focusedSliderDot: null as SliderDot,
      focusedSliderDotIndex: null,
      value: null,
      position: null,
      color: null,
      isDotsTransitionStopped: false,
      deleteListener: null
    }
  },

  methods: {
    stopDotsTransition() {
      this.isDotsTransitionStopped = true
      setTimeout(() => this.isDotsTransitionStopped = false, 500)
    },

    switchToCustomColormapPreset() {
      if (this.colormapPreset.preset !== ColormapPresets.CUSTOM) {
        this.$store.dispatch('SET_CUSTOM_PRESET', this.sliderDots)
        this.colormapPreset = this.storeColormapPresets.find(preset => preset.preset === ColormapPresets.CUSTOM)
      }
    },

    getSortedSliderDots() {
      return [...this.sliderDots].sort((a, b) => a.value - b.value)
    },

    dropFocusedSliderDot() {
      this.focusedSliderDot = null
      this.focusedSliderDotIndex = null
      this.value = null
      this.position = null
      this.color = null
    },

    changePreset(event: any) {
      if (event.value.preset !== ColormapPresets.CUSTOM) {
        this.stopDotsTransition()

        const presetSliderDots = JSON.parse(JSON.stringify(
            this.storeColormapPresets.find(preset => preset.preset === event.value.preset).sliderDots
        ))
        presetSliderDots.forEach((dot: SliderDot) => {
          dot.value = countValue(dot.perCentValue, this.sliderMinValue, this.sliderMaxValue)
        })

        this.sliderDots = presetSliderDots
        this.sliderDotsValues = this.sliderDots.map(dot => dot.value);
        (this.$refs.slider as any).setValue(this.sliderDotsValues)

        this.dropFocusedSliderDot()
      }
    },

    setSliderDotValue() {
      if (this.value < this.sliderMinValue) {
        this.value = this.sliderMinValue
      } else if (this.value > this.sliderMaxValue) {
        this.value = this.sliderMaxValue
      }

      this.focusedSliderDot.value = this.sliderDotsValues[this.focusedSliderDotIndex] = this.value
      this.focusedSliderDot.perCentValue = this.position = countPerCent(this.value, this.sliderMinValue, this.sliderMaxValue);
      (this.$refs.slider as any).setValue(this.sliderDotsValues)

      this.switchToCustomColormapPreset()
    },

    setSliderDotPerCentValue() {
      this.focusedSliderDot.perCentValue = this.position
      this.focusedSliderDot.value = this.sliderDotsValues[this.focusedSliderDotIndex] = this.value =
          countValue(this.position, this.sliderMinValue, this.sliderMaxValue);
      (this.$refs.slider as any).setValue(this.sliderDotsValues)
      this.switchToCustomColormapPreset()
    },

    onDragStart(event: any) {
      this.focusedSliderDotIndex = event
      this.focusedSliderDot = this.sliderDots[event]
      this.value = this.focusedSliderDot.value
      this.position = this.focusedSliderDot.perCentValue
      this.color = this.focusedSliderDot.color.rgbObj
    },

    onDragging(event: any) {
      this.value = this.sliderDots[this.focusedSliderDotIndex].value = event[this.focusedSliderDotIndex]
      this.position = this.sliderDots[this.focusedSliderDotIndex].perCentValue =
          countPerCent(this.value, this.sliderMinValue, this.sliderMaxValue)
      this.switchToCustomColormapPreset()
    },

    getDotStyle(index: number) {
      return `background-color: ${this.sliderDots[index]?.color.rgb}`
    },

    getDotShadowStyle(index: number) {
      const color: Color = this.sliderDots[index]?.color
      return `background-color: rgba(${color.rgbObj.r}, ${color.rgbObj.g}, ${color.rgbObj.b}, 0.38)`
    },

    addSliderDot() {
      const sortedSliderDots = this.getSortedSliderDots()
      const lastSliderDot = sortedSliderDots[sortedSliderDots.length - 1]
      const preLastSliderDot = sortedSliderDots[sortedSliderDots.length - 2]

      let newDotValue: number
      let newDotColor: Color
      if (lastSliderDot && preLastSliderDot) {
        newDotValue = Math.round((lastSliderDot.value + preLastSliderDot.value) / 2)
        newDotColor = new Color(
            'RGB(' + Math.round((lastSliderDot.color.rgbObj.r + preLastSliderDot.color.rgbObj.r) / 2) +
            ',' + Math.round((lastSliderDot.color.rgbObj.g + preLastSliderDot.color.rgbObj.g) / 2) +
            ',' + Math.round((lastSliderDot.color.rgbObj.b + preLastSliderDot.color.rgbObj.b) / 2) + ')'
        )
      } else {
        if (lastSliderDot && lastSliderDot.value === this.sliderMaxValue) {
          newDotValue = this.sliderMinValue
        } else {
          newDotValue = this.sliderMaxValue
        }
        newDotColor = new Color('RGB(0,0,0)')
      }

      this.sliderDots.push({
        value: newDotValue,
        perCentValue: countPerCent(newDotValue, this.sliderMinValue, this.sliderMaxValue),
        color: newDotColor
      } as SliderDot)
      this.sliderDotsValues.push(newDotValue);
      (this.$refs.slider as any).setValue(this.sliderDotsValues)
      this.onDragStart(this.sliderDotsValues.length - 1)

      this.switchToCustomColormapPreset()
    },

    deleteSliderDot() {
      if (this.focusedSliderDot) {
        this.stopDotsTransition()

        this.sliderDots.splice(this.focusedSliderDotIndex, 1)
        this.sliderDotsValues.splice(this.focusedSliderDotIndex, 1);
        (this.$refs.slider as any).setValue(this.sliderDotsValues)
        this.dropFocusedSliderDot()

        this.switchToCustomColormapPreset()
      }
    },

    getGradientStyle() {
      return getGradientStyle(this.getSortedSliderDots(), this.colormapType)
    },

    invertSlider() {
      this.stopDotsTransition()
      this.switchToCustomColormapPreset()
      this.dropFocusedSliderDot()

      for (let i = 0; i < this.sliderDots.length; i++) {
        this.sliderDots[i].perCentValue = 100 - this.sliderDots[i].perCentValue
        this.sliderDots[i].value = this.sliderDotsValues[i] =
            countValue(this.sliderDots[i].perCentValue, this.sliderMinValue, this.sliderMaxValue);
        (this.$refs.slider as any).setValue(this.sliderDotsValues)
      }
    },

    applyColormap() {
      this.$store.dispatch('APPLY_COLORMAP', {
        type: this.colormapType,
        preset: this.colormapPreset.preset,
        sliderDots: this.getSortedSliderDots()
      } as Colormap)

      this.dropFocusedSliderDot()
      this.$store.dispatch('HIDE_COLORMAP_DIALOG')
    }
  },

  computed: {
    showStoreColormapDialog(): boolean {
      return this.$store.getters.showColormapDialog
    },

    storeColormap(): Colormap {
      return this.$store.getters.colormap
    },

    palette(): Palette {
      return this.$store.getters.palette
    },

    storeColormapPresets(): Colormap[] {
      return this.$store.getters.colormapPresets
    },

    isLinesDialog(): boolean {
      return this.$store.getters.isLinesDialog
    }
  },

  watch: {
    showStoreColormapDialog(value) {
      if (value) {
        this.deleteListener = (event: KeyboardEvent) => {
          if (event.keyCode === 46 || event.key === 'Delete') {
            this.deleteSliderDot()
          }
        }
        document.addEventListener('keydown', this.deleteListener)
      } else {
        document.removeEventListener('keydown', this.deleteListener)
        this.deleteListener = null
      }
      this.showColormapDialog = value
    },

    showColormapDialog(value) {
      if (!value) {
        this.$store.dispatch('HIDE_COLORMAP_DIALOG')
      }
    },

    storeColormap(value: Colormap) {
      if (value) {
        this.colormapType = value.type
        this.colormapPreset = this.storeColormapPresets.find(preset => preset.preset === value.preset)
        this.sliderDots = JSON.parse(JSON.stringify(value.sliderDots))
        this.sliderDotsValues = this.sliderDots?.map(slider => slider.value)
        this.sliderMinValue = this.sliderDots[0].value
        this.sliderMaxValue = this.sliderDots[this.sliderDots?.length - 1].value
      }
    },

    color(value: any) {
      if (value && this.focusedSliderDot) {
        this.focusedSliderDot.color = new Color(`RGB(${value.r}, ${value.g}, ${value.b})`)
      }
    }
  }
})
</script>

<style scoped lang="stylus">
@import '../assets/styles/vars'

.colormap
  &-panel
    margin-bottom 30px
  &-preset
    margin-top 20px
    &__dropdown
      width 100%
    &__option
      align-items center
    &__gradient
      height 30px
      border 1px solid $border-base
      border-radius 3px
      margin-right 20px
      transition 0.3s
  &-apply
    justify-content flex-end

.slider

  &-controls
    margin-bottom 20px
    .dot
      &-value
        margin-right 20px
      &-color
        margin-top 10px
    .p-divider:before
      border-left-style solid

  &-inputs
    flex-direction column
    align-items stretch
    margin-right 20px

  &-btns
    flex-direction column
    align-items stretch
  &-btn
    .p-dropdown
      width: 100%
    &:first-child
      margin 25px 0 10px 0

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

.gradient
  width 100%
  height 50px
  border 1px solid $border-base
  border-radius 3px
  margin-top 20px
  transition 0.3s
</style>