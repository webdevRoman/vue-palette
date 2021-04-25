<template>
  <Dialog class="dialog-scale" header="Масштабирование" v-model:visible="showScaleDialog" modal>

    <div class="data-limits">
      Граничные значения данных: {{ levels[0].value }} - {{ levels[levels.length - 1].value }}
    </div>

    <div class="flex flex-sb">

      <div class="scale-left">
        <div class="scale-input p-field">
          <span class="p-float-label">
            <InputNumber id="min" v-model="min" :class="`${wrongMin ? 'input_wrong' : ''}`" @input="wrongMin = false"/>
            <label for="min">Минимум</label>
          </span>
        </div>

        <div class="scale-input p-field">
          <span class="p-float-label">
            <InputNumber id="max" v-model="max" :class="`${wrongMax ? 'input_wrong' : ''}`" @input="wrongMax = false"/>
            <label for="max">Максимум</label>
          </span>
        </div>

        <div class="scale-input p-field">
          <span class="p-float-label">
            <InputNumber id="interval" v-model="interval"
                         :class="`${wrongInterval ? 'input_wrong' : ''}`" @input="wrongInterval = false"/>
            <label for="interval">Интервал</label>
          </span>
        </div>
      </div>

      <div class="scale-right flex flex-sb">
        <div class="scale-checkboxes">
          <div class="scale-checkbox">
            <Checkbox class="scale-checkbox__box" id="scale-lines" v-model="isScaleLines" :binary="true"/>
            <label class="scale-checkbox__label" for="scale-lines">Масштабировать линии уровня</label>
          </div>
          <div class="scale-checkbox">
            <Checkbox class="scale-checkbox__box" id="scale-filling" v-model="isScaleFilling" :binary="true"/>
            <label class="scale-checkbox__label" for="scale-filling">Масштабировать цвета закраски между линиями
              уровня</label>
          </div>
        </div>

        <Button label="Применить" @click="checkScaleForm" :disabled="wrongMin || wrongMax || wrongInterval"/>
      </div>

    </div>

  </Dialog>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {Level} from '@/models/Level'
import {Field, Validator, ValidationError} from '@/store/errors'
import {ScaleInfo} from '@/store/scale'

export default defineComponent({

  name: 'ScaleDialog',

  data() {
    return {
      showScaleDialog: false,
      min: null,
      max: null,
      interval: null,
      isScaleLines: false,
      isScaleFilling: false,
      wrongMin: false,
      wrongMax: false,
      wrongInterval: false
    }
  },

  methods: {
    async checkScaleForm() {
      try {
        await this.$store.dispatch('CHECK_FIELDS', [
          {name: 'scale_min', value: this.min, validators: [Validator.EMPTY]} as Field,
          {name: 'scale_max', value: this.max, validators: [Validator.EMPTY]} as Field,
          {name: 'scale_interval', value: this.interval, validators: [Validator.EMPTY]} as Field
        ])
        this.wrongMin = false
        this.wrongMax = false
        this.wrongInterval = false
      } catch (error) {
        if (error.length && error[0].field) {
          error.forEach(err => {
            if (err.field.name === 'scale_min') {
              this.wrongMin = true
            }
            if (err.field.name === 'scale_max') {
              this.wrongMax = true
            }
            if (err.field.name === 'scale_interval') {
              this.wrongInterval = true
            }
          })
        }
        return
      }

      if (!this.wrongMin && !this.wrongMax && !this.wrongInterval) {
        if (this.min > this.max) {
          this.wrongMin = true
          this.wrongMax = true
          return
        } else if (this.max - this.min < this.interval) {
          this.wrongInterval = true
          return
        }
      }

      this.$store.dispatch('SCALE_LEVELS', {
        scaleMin: this.min,
        scaleMax: this.max,
        scaleInterval: this.interval,
        isScaleLines: this.isScaleLines,
        isScaleFilling: this.isScaleFilling
      } as ScaleInfo)
      this.$store.dispatch('HIDE_SCALE_DIALOG')
    }
  },

  computed: {
    showStoreScaleDialog(): boolean {
      return this.$store.getters.showScaleDialog
    },

    levels(): Level[] {
      return this.$store.getters.levels
    }
  },

  watch: {
    showStoreScaleDialog(value) {
      this.showScaleDialog = value
    },

    showScaleDialog(value) {
      if (!value) {
        this.$store.dispatch('HIDE_SCALE_DIALOG')
      }
    }
  },

  created() {
    this.min = this.$store.getters.scaleMin
    this.max = this.$store.getters.scaleMax
    this.interval = this.$store.getters.scaleInterval
  }
})
</script>

<style scoped lang="stylus">
.data-limits
  margin-bottom 50px

.scale
  &-input
    margin-bottom 35px

    &:last-child
      margin-bottom 0

  &-right
    flex-direction column
    align-items flex-end

  &-checkbox
    margin-bottom 20px

    &__box
      vertical-align middle
      margin-right 10px

    &__label
      display inline-block
      max-width 280px
      vertical-align middle
      cursor pointer
</style>