<template>
  <Dialog class="dialog-line dialog-md" header="Редактирование линии" v-model:visible="showLineDialog" modal>

    <div class="flex flex-sb">
      <div class="line-left">
        <div class="line-property line-style">
          <span class="p-float-label">
            <Dropdown id="line-style" v-model="style" :options="lineStyles" placeholder="Стиль линии">
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
            <label for="line-style">Стиль линии</label>
          </span>
        </div>

        <div class="line-property line-color">
          <label class="label">Цвет линии</label>
          <ColorPicker v-model="color" format="rgb" class="cell cell-fill"/>
        </div>

        <div class="line-property line-width">
          <span class="p-float-label">
            <InputNumber id="line-width" v-model="width" :min="0" :max="50"
                         :class="`${wrongWidth ? 'input_wrong' : ''}`" @input="wrongWidth = false"/>
            <label for="line-width">Ширина линии</label>
          </span>
        </div>
      </div>

      <div class="line-right flex flex-sb">
        <Panel header="Пример" class="line-example">
          <div class="line-style__option"
               :style="`border-top: ${width}px ${style.toLowerCase()} RGB(${color.r},${color.g},${color.b})`">
          </div>
        </Panel>

        <Button label="Применить" @click="checkLineForm" :disabled="wrongWidth"/>
      </div>
    </div>

  </Dialog>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {Level} from '@/models/Level'
import {LineStyles} from '@/models/LineStyles'
import {Field, Validator} from '@/store/errors'
import {ScaleInfo} from '@/store/scale'

export default defineComponent({

  name: 'LineDialog',

  data() {
    return {
      showLineDialog: false,
      lineStyles: Object.keys(LineStyles),
      style: null,
      color: null,
      width: null,
      wrongWidth: false
    }
  },

  methods: {
    async checkLineForm() {
      try {
        await this.$store.dispatch('CHECK_FIELDS', [
          {name: 'line_width', value: this.width, validators: [Validator.EMPTY]} as Field
        ])
        this.wrongWidth = false
      } catch (error) {
        if (error.length && error[0].field) {
          error.forEach(err => {
            if (err.field.name === 'line_width') {
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

      this.$store.dispatch('UPDATE_LINE', {
        style: this.style,
        color: `RGB(${this.color.r},${this.color.g},${this.color.b})`,
        width: this.width
      })
      this.$store.dispatch('HIDE_LINE_DIALOG')
    }
  },

  computed: {
    showStoreLineDialog(): boolean {
      return this.$store.getters.showLineDialog
    },

    editableLevelLine(): Level {
      return this.$store.getters.editableLevelLine
    }
  },

  watch: {
    showStoreLineDialog(value) {
      this.showLineDialog = value
    },

    showLineDialog(value) {
      if (!value) {
        this.$store.dispatch('HIDE_LINE_DIALOG')
      } else {
        this.style = this.editableLevelLine?.lineStyle
        this.color = this.editableLevelLine?.lineColor.rgbObj
        this.width = this.editableLevelLine?.lineWidth
      }
    }
  }
})
</script>

<style scoped lang="stylus">
.line
  &-right
    flex-basis 50%
    flex-direction column
    align-items flex-end

  &-property
    margin-bottom 45px

    &:last-child
      margin-bottom 0

  &-style
    margin-bottom 20px

    &__option
      height 10px
      margin-top 10px

  &-width
    margin-top 45px

  &-example
    width 100%
</style>