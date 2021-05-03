<template>
  <Dialog class="dialog-colormap dialog-xl" header="Редактирование цветовой карты" v-model:visible="showColormapDialog"
          modal maximizable :closeOnEscape="false" @hide="dropFocusedSliderDot">

    <Panel header="Выбор из готовых вариантов" class="colormap-panel colormap-presets">

    </Panel>

    <Panel header="Редактирование цветовой карты" class="colormap-panel colormap">
      <div class="flex flex-sb slider-controls">
        <div class="flex-70 flex flex-sb slider-inputs">
          <div class="slider-controls__line flex">
            <div class="slider-input dot-value">
              <span class="p-float-label">
                <InputNumber id="value" v-model="value" :disabled="!focusedSliderDot"
                             @focusout="setSliderDotValue" @keypress.enter="setSliderDotValue"
                             :minFractionDigits="2" :maxFractionDigits="2"/>
                <label for="value">Значение</label>
              </span>
            </div>
            <div class="slider-input">
              <span class="p-float-label">
                <InputNumber id="position" v-model="position" :disabled="!focusedSliderDot"
                             @focusout="setSliderDotPerCentValue" @keypress.enter="setSliderDotPerCentValue"
                             :minFractionDigits="2" :maxFractionDigits="2" suffix="%" :min="0" :max="100"/>
                <label for="position">Позиция</label>
              </span>
            </div>
          </div>
          <div class="dot-color">
            <label class="label">Цвет линии</label>
            <ColorPicker v-model="color" format="rgb" :disabled="!focusedSliderDot" class="cell"/>
          </div>
        </div>

        <div class="flex-25 flex flex-sb slider-btns">
          <Button class="slider-btn" label="Добавить точку" @click="addSliderDot"/>
          <Button class="slider-btn" label="Удалить точку" @click="deleteSliderDot" :disabled="!focusedSliderDot"/>
        </div>
      </div>

      <vue-slider
          :class="[{ 'slider-deleting': isDeletingDot }]"
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
          @drag-start="onDragStart($event)"
          @drag-end="onDragEnd($event)"
          @dragging="onDragging($event)">
        <template #dot="{value, index}">
          <div :style="getDotStyle(index)"
               :class="['slider-dot', { 'slider-dot_focus': focusedSliderDot ? value === focusedSliderDot.value : false }]">
            <div class="slider-dot__shadow" :style="getDotShadowStyle(index)"></div>
          </div>
        </template>
      </vue-slider>
    </Panel>

    <div class="flex colormap-apply">
      <Button label="Применить" @click="applyColormap"/>
    </div>

  </Dialog>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {SliderDot} from '@/models/SliderDot'
import {Color} from '@/models/Color'
import {countPerCent} from '@/store/scale'

export default defineComponent({

  name: 'ColormapDialog',

  data() {
    return {
      showColormapDialog: false,
      sliderDots: null as SliderDot[],
      sliderDotsValues: null,
      sliderMinValue: null,
      sliderMaxValue: null,
      focusedSliderDot: null as SliderDot,
      focusedSliderDotIndex: null,
      value: null,
      position: null,
      color: null,
      isDeletingDot: false,
      deleteListener: null
    }
  },

  methods: {
    setSliderDotValue() {
      if (this.value < this.sliderMinValue) {
        this.value = this.sliderMinValue
      } else if (this.value > this.sliderMaxValue) {
        this.value = this.sliderMaxValue
      }
      this.focusedSliderDot.value = this.sliderDotsValues[this.focusedSliderDotIndex] = this.value
      this.focusedSliderDot.perCentValue = this.position = countPerCent(this.value, this.sliderMinValue, this.sliderMaxValue);
      (this.$refs.slider as any).setValue(this.sliderDotsValues)
    },

    setSliderDotPerCentValue() {
      this.focusedSliderDot.perCentValue = this.position
      this.focusedSliderDot.value = this.sliderDotsValues[this.focusedSliderDotIndex] = this.value =
          this.sliderMinValue + (this.sliderMaxValue - this.sliderMinValue) * this.position / 100;
      (this.$refs.slider as any).setValue(this.sliderDotsValues)
    },

    onDragStart(event: any) {
      this.focusedSliderDotIndex = event
      this.focusedSliderDot = this.sliderDots[event]
      this.value = this.focusedSliderDot.value
      this.position = this.focusedSliderDot.perCentValue
      this.color = this.focusedSliderDot.color.rgbObj
    },

    onDragging(event: any) {
      this.value = event[this.focusedSliderDotIndex]
      this.position = countPerCent(this.value, this.sliderMinValue, this.sliderMaxValue)
    },

    onDragEnd(event: any) {
      this.sliderDots[event].value = this.sliderDotsValues[event]
      this.sliderDots[event].perCentValue = countPerCent(this.sliderDotsValues[event], this.sliderMinValue, this.sliderMaxValue)
    },

    getDotStyle(index: number) {
      return `background-color: ${this.sliderDots[index]?.color.rgb}`
    },

    getDotShadowStyle(index: number) {
      const color: Color = this.sliderDots[index]?.color
      return `background-color: rgba(${color.rgbObj.r}, ${color.rgbObj.g}, ${color.rgbObj.b}, 0.38)`
    },

    addSliderDot() {
      const sliderDotsCopy = [...this.sliderDots]
      sliderDotsCopy.sort((a, b) => a.value - b.value)
      const lastSliderDot = sliderDotsCopy[sliderDotsCopy.length - 1]
      const preLastSliderDot = sliderDotsCopy[sliderDotsCopy.length - 2]

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
    },

    deleteSliderDot() {
      if (this.focusedSliderDot) {
        this.isDeletingDot = true
        setTimeout(() => this.isDeletingDot = false, 500)

        this.sliderDots.splice(this.focusedSliderDotIndex, 1)
        this.sliderDotsValues.splice(this.focusedSliderDotIndex, 1);
        (this.$refs.slider as any).setValue(this.sliderDotsValues)
        this.dropFocusedSliderDot()
      }
    },

    applyColormap() {
      // console.log('apply');
      // (this.$refs.slider as any).focus(1)
    },

    dropFocusedSliderDot() {
      this.focusedSliderDot = null
      this.focusedSliderDotIndex = null
      this.value = null
      this.position = null
      this.color = null
    }
  },

  computed: {
    showStoreColormapDialog(): boolean {
      return this.$store.getters.showColormapDialog
    },

    storeSliderDots(): SliderDot[] {
      return this.$store.getters.sliderDots
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

    storeSliderDots(value: SliderDot[]) {
      if (value) {
        this.sliderDots = [...value]
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
.colormap
  &-panel
    margin-bottom 30px
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

  &-inputs
    flex-direction column
    align-items stretch
    margin-right 20px
  &-input
    margin-top 20px

  &-btns
    flex-direction column
    align-items stretch
  &-btn:first-child
    margin 20px 0 10px 0

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