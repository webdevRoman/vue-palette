<template>
  <div class="cell">

    <div v-if="level.editValue" class="level-value">
      <InputNumber v-model="level.value"
                   :class="`level-value__input ${level.wrongValue ? 'level-value__input_wrong' : ''}`"
                   @keyup.enter="changeLevelValue"
                   @keyup.esc="resetLevelValue"
                   @focusout="checkValue"/>
      <Button icon="pi pi-times" class="p-button-danger level-value__btn"
              @click="resetLevelValue"/>
      <Button icon="pi pi-check" class="p-button-success level-value__btn"
              @click="changeLevelValue"/>
    </div>

    <Button v-else
            :label="level.value.toString()" class="cell p-button-text p-button-plain"
            @click="setEditableLevel"/>

  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'
import {Level} from '@/models/Level'

export default defineComponent({

  name: 'LevelValue',

  props: {
    propsLevel: {
      type: Object as PropType<Level>,
      required: true
    }
  },

  data() {
    return {
      level: { ...this.propsLevel },
      oldValue: this.propsLevel.value
    }
  },

  methods: {
    setEditableLevel() {
      this.level.editValue = true
      setTimeout(() => {
        const input = document.querySelector('.level-value__input').childNodes[0] as HTMLInputElement
        input.focus()
      }, 0)
    },

    checkValue() {
      if (this.level.value) {
        this.level.wrongValue = false
      } else {
        this.level.wrongValue = true
      }
    },

    changeLevelValue() {
      if (this.level.value) {
        this.level.editValue = false
        this.level.wrongValue = false
        if (this.level.value !== this.oldValue) {
          this.$store.dispatch('SET_LEVEL_VALUE', this.level)
          this.$store.dispatch('SORT_LEVELS')
        }
      } else {
        this.level.wrongValue = true
      }
    },

    resetLevelValue() {
      const input = document.querySelector('.level-value__input').childNodes[0] as HTMLInputElement
      input.blur()
      this.level.value = this.oldValue
      this.level.editValue = false
    }
  },

  computed: {
    editableLevel(): Level {
      return this.$store.getters.editableLevel
    },

    levels(): Level[] {
      return this.$store.getters.levels
    }
  }

})
</script>

<style scoped lang="stylus">
.cell
  width 100%

.level
  &-value
    display flex
    justify-content space-between
    align-items center
    margin-right 90px
    &__btn
      flex-shrink 0
      margin-left 5px
</style>