<template>
  <div class="cell">

    <div v-if="editMode" class="level-value">
      <InputNumber v-model="level.value"
                   :class="`level-value__input ${wrongValue ? 'input_wrong' : ''}`"
                   @keyup.enter="changeLevelValue"
                   @keyup.esc="resetLevelValue"/>
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
import {Field, ValidationError, Validator} from '@/store/errors'

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
      level: {...this.propsLevel},
      oldValue: this.propsLevel.value,
      editMode: false,
      wrongValue: false
    }
  },

  methods: {
    setEditableLevel() {
      this.editMode = true
      setTimeout(() => {
        const input = document.querySelector('.level-value__input').childNodes[0] as HTMLInputElement
        input.focus()
      }, 0)
    },

    async checkValue() {
      try {
        await this.$store.dispatch(
            'CHECK_FIELDS',
            [{name: 'level_' + this.level.id, value: this.level.value, validators: [Validator.EMPTY]} as Field]
        )
        this.wrongValue = false
      } catch (err) {
        this.wrongValue = true
      }
    },

    async changeLevelValue() {
      await this.checkValue()
      if (!this.wrongValue) {
        this.editMode = false
        if (this.level.value !== this.oldValue) {
          this.$store.dispatch('SET_LEVEL_VALUE', this.level)
          this.$store.dispatch('SORT_LEVELS')
        }
      }
    },

    resetLevelValue() {
      const input = document.querySelector('.level-value__input').childNodes[0] as HTMLInputElement
      input.blur()
      this.level.value = this.oldValue
      this.editMode = false
      this.$store.dispatch(
          'REMOVE_ERROR',
          {field: {name: 'level_' + this.level.id, value: this.level.value, validators: []} as Field} as ValidationError
      )
    }
  },

  computed: {
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