<template>
  <Dialog class="dialog-line dialog-md" header="Редактирование линий" v-model:visible="showLinesDialog" modal>

    <div class="flex flex-sb">
      <div class="line-left">

        <div class="line-property line-style">
          <div class="checkbox line-checkbox">
            <Checkbox class="checkbox__box" id="lines-style-available" v-model="linesStyleAvailable" :binary="true"/>
            <label class="checkbox__label" for="lines-style-available">Задать стиль для всех линий</label>
          </div>
          <span class="p-float-label">
            <Dropdown id="line-style" v-model="style" :options="lineStyles" :disabled="!linesStyleAvailable"
                      class="fullwidth" placeholder="Стиль линий">
              <template #value="slotProps">
                <div class="line-style__option" v-if="slotProps.value"
                     :style="`border-top: 2px ${slotProps.value.toLowerCase()} #000000`">
                </div>
                <span v-else>
                  {{ slotProps.placeholder }}
                </span>
              </template>
              <template #option="slotProps">
                <div class="line-style__option"
                     :style="`border-top: 2px ${slotProps.option.toLowerCase()} #000000`">
                </div>
              </template>
            </Dropdown>
            <label for="line-style">Стиль линий</label>
          </span>
        </div>

        <div class="line-property line-width">
          <div class="checkbox line-checkbox">
            <Checkbox class="checkbox__box" id="lines-width-available" v-model="linesWidthAvailable" :binary="true"/>
            <label class="checkbox__label" for="lines-width-available">Задать ширину для всех линий</label>
          </div>
          <span class="p-float-label">
            <InputNumber id="line-width" v-model="width" :min="0" :max="50" :disabled="!linesWidthAvailable"
                         :class="`fullwidth ${wrongWidth ? 'input_wrong' : ''}`" @input="wrongWidth = false"/>
            <label for="line-width">Ширина линий</label>
          </span>
        </div>

      </div>

      <div class="line-right flex flex-sb">
        <div class="line-property line-color">
          <div class="checkbox line-checkbox">
            <Checkbox class="checkbox__box" id="lines-color-available" v-model="linesColorAvailable" :binary="true"/>
            <label class="checkbox__label" for="lines-color-available">Задать цвет для всех линий</label>
          </div>
          <label class="label">Цвет линий</label>
          <div class="line-color__radios">
            <div class="line-color__radio">
              <RadioButton id="lines-color-type-color" name="linesColorType" :disabled="!linesColorAvailable"
                           :value="false" v-model="isLinesColormap" />
              <label for="lines-color-type-color">Один цвет для всех линий</label>
            </div>
            <div class="line-color__radio">
              <RadioButton id="lines-color-type-colormap" name="linesColorType" :disabled="!linesColorAvailable"
                           :value="true" v-model="isLinesColormap" />
              <label for="lines-color-type-colormap">Цветовая карта</label>
            </div>
          </div>
          <Button v-if="isLinesColormap" @click="showColormapDialog()" :disabled="!linesColorAvailable"
                  class="fullwidth line-color__colormap" :style="getGradientStyle()"></Button>
          <ColorPicker v-else v-model="color" format="rgb" :disabled="!linesColorAvailable"
                       class="fullwidth cell cell-fill"/>
        </div>

        <Button label="Применить" @click="checkLinesForm()" :disabled="wrongWidth"/>
      </div>
    </div>

  </Dialog>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {getGradientStyle} from '@/store/colormap'
import {Level} from '@/models/Level'
import {LineStyles} from '@/models/LineStyles'
import {Field, Validator} from '@/store/errors'
import {Colormap} from '@/models/Colormap'
import {ColormapInitiators} from '@/models/ColormapInitiators'
import {Color} from '@/models/Color'

export default defineComponent({

  name: 'LinesDialog',

  data() {
    return {
      showLinesDialog: false,
      linesStyleAvailable: true,
      lineStyles: Object.keys(LineStyles),
      style: LineStyles.SOLID,
      linesWidthAvailable: true,
      width: 1,
      wrongWidth: false,
      linesColorAvailable: true,
      isLinesColormap: false,
      color: { r: 0, g: 0, b: 0 }
    }
  },

  methods: {
    getGradientStyle() {
      return getGradientStyle(this.colormap.sliderDots, this.colormap.type)
    },

    showColormapDialog() {
      this.$store.dispatch('SHOW_COLORMAP_DIALOG', ColormapInitiators.LINES)
    },

    async checkLinesForm() {
      try {
        await this.$store.dispatch('CHECK_FIELDS', [
          {name: 'lines_width', value: this.width, validators: [Validator.EMPTY]} as Field
        ])
        this.wrongWidth = false
      } catch (error) {
        if (error.length && error[0].field) {
          error.forEach(err => {
            if (err.field.name === 'lines_width') {
              this.wrongWidth = true
            }
          })
        }
        return
      }

      if (this.width < 0) {
        this.wrongWidth = true
        return
      }

      if (this.linesStyleAvailable) {
        this.$store.dispatch('SET_LINES_STYLE', this.style)
      }
      if (this.linesWidthAvailable) {
        this.$store.dispatch('SET_LINES_WIDTH', this.width)
      }
      if (this.linesColorAvailable) {
        if (this.isLinesColormap) {
          this.$store.dispatch('APPLY_COLORMAP_TO_PALETTE', this.colormap)
        } else {
          this.$store.dispatch(
              'SET_LINES_COLOR',
              new Color(`RGB(${this.color.r},${this.color.g},${this.color.b})`)
          )
        }
      }

      this.$store.dispatch('HIDE_LINES_DIALOG')
    }
  },

  computed: {
    showStoreLinesDialog(): boolean {
      return this.$store.getters.showLinesDialog
    },

    editableLevelLine(): Level {
      return this.$store.getters.editableLevelLine
    },

    colormap(): Colormap {
      return this.$store.getters.colormap
    }
  },

  watch: {
    showStoreLinesDialog(value) {
      this.showLinesDialog = value
    },

    showLinesDialog(value) {
      if (!value) {
        this.$store.dispatch('HIDE_LINES_DIALOG')
      } else {
        this.linesStyleAvailable = true
        this.style = LineStyles.SOLID
        this.linesWidthAvailable = true
        this.width = 1
        this.wrongWidth = false
        this.linesColorAvailable = true
        this.isLinesColormap = false
        this.color = { r: 0, g: 0, b: 0 }
      }
    },

    isLinesColormap(value) {
      if (value) {
        this.color = { r: 0, g: 0, b: 0 }
      }
    }
  }
})
</script>

<style scoped lang="stylus">
@import '../assets/styles/vars'

.line
  &-right
    flex-basis 50%
    flex-direction column
    align-items flex-end
    margin-left 30px
    .line-checkbox
      margin-bottom 10px
  &-checkbox
    margin-bottom 35px
  &-property
    margin-bottom 45px
    &:last-child
      margin-bottom 0

  &-style__option
    height 10px
    margin-top 10px

  &-color
    &__radio
      margin-bottom 10px
      label
        margin-left 10px
        cursor pointer
    &__colormap
      height 36px
      border 1px solid $border-base
      border-radius 3px
</style>