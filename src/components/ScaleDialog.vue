<template>
  <Dialog class="dialog-scale" header="Масштабирование" v-model:visible="showScaleDialog" modal>

    <div class="data-limits">
      Граничные значения данных: {{ levels[0].value }} - {{ levels[levels.length - 1].value }}
    </div>

    <div class="flex flex-sb">

      <div class="scale-left">
        <div class="scale-input p-field">
          <span class="p-float-label">
            <InputNumber id="min" v-model="min"/>
            <label for="min">Минимум</label>
          </span>
        </div>

        <div class="scale-input p-field">
          <span class="p-float-label">
            <InputNumber id="max" v-model="max"/>
            <label for="max">Максимум</label>
          </span>
        </div>

        <div class="scale-input p-field">
          <span class="p-float-label">
            <InputNumber id="interval" v-model="interval"/>
            <label for="interval">Интервал</label>
          </span>
        </div>
      </div>

      <div class="scale-right flex flex-sb">
        <div class="scale-checkboxes">
          <div class="scale-checkbox">
            <Checkbox class="scale-checkbox__box" id="scale-lines" v-model="scaleLines" :binary="true"/>
            <label class="scale-checkbox__label" for="scale-lines">Масштабировать цвета линий уровня</label>
          </div>
          <div class="scale-checkbox">
            <Checkbox class="scale-checkbox__box" id="scale-filling" v-model="scaleFilling" :binary="true"/>
            <label class="scale-checkbox__label" for="scale-filling">Масштабировать цвета закраски между линиями
              уровня</label>
          </div>
        </div>

        <Button label="Применить"/>
      </div>

    </div>

  </Dialog>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {Level} from '@/models/Level'

export default defineComponent({

  name: 'ScaleDialog',

  data() {
    return {
      showScaleDialog: false,
      min: null,
      max: null,
      interval: null,
      scaleLines: false,
      scaleFilling: false
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