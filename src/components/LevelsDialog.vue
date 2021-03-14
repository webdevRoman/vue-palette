<template>
  <Dialog header="Линии уровня" v-model:visible="showLevelsDialog" modal dismissableMask maximizable>

    <div class="flex flex-horizontal">

      <DataTable class="flex-75" :value="levels" v-model:selection="selectedLevels" dataKey="value">
        <Column :selectionMode="deleteMode ? 'multiple' : 'none'"
                :style="`width: ${deleteMode ? '60' : '0'}px`"></Column>

        <Column field="value">
          <template #header>
            <Button label="Значение" class="cell cell-header p-button-text p-button-plain"/>
          </template>
          <template #body="{data}">
            <Button :label="data.value.toString()" class="cell p-button-text p-button-plain"/>
          </template>
        </Column>

        <Column>
          <template #header>
            <Button label="Линия" class="cell cell-header p-button-text p-button-plain"/>
          </template>
          <template #body="{data}">
            <Button class="p-button-text p-button-plain cell">
              <div class="cell-line"
                   :style="`border-top: ${data.lineWidth}px ${data.lineStyle.toLowerCase()} ${data.lineColor.hex}`">
              </div>
            </Button>
          </template>
        </Column>

        <Column field="fillColor">
          <template #header>
            <Button label="Цвет закраски" class="cell cell-header p-button-text p-button-plain"/>
          </template>
          <template #body="{data}">
            <Button class="cell cell-color" :style="`background-color: ${data.fillColor.hex}`"/>
          </template>
        </Column>
      </DataTable>

      <div class="controls flex-25" v-if="deleteMode">
        <Button label="Подтвердить"/>
        <Button label="Отменить" @click="deleteMode = false"/>
      </div>
      <div class="controls flex-25" v-else>
        <Button label="Добавить уровень"/>
        <Button label="Удалить уровни" @click="deleteMode = true"/>
        <Button label="Сохранить"/>
      </div>

    </div>

  </Dialog>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {LineStyles} from '@/models/LineStyles'

export default defineComponent({

  name: 'LevelsDialog',

  data() {
    return {
      showLevelsDialog: false,
      LineStyles: LineStyles,
      deleteMode: false,
      selectedLevels: null
    }
  },

  computed: {
    showStoreLevelsDialog() {
      return this.$store.getters.showLevelsDialog
    },

    levels() {
      return this.$store.getters.levels
    }
  },

  watch: {
    showStoreLevelsDialog(value) {
      this.showLevelsDialog = value
    },

    showLevelsDialog(value) {
      if (!value) {
        this.$store.dispatch('HIDE_LEVELS_DIALOG')
      }
    }
  }

})
</script>

<style scoped lang="stylus">
@import '../assets/styles/vars'

.cell
  width 100%

  &-header
    font-weight 500

  &-color
    border 1px solid $cFontDark

  &-line
    width 100%
    height 10px
    margin-top 10px

.controls
  margin-left 20px

  button
    width 100%
    margin-bottom 10px

    &:last-child
      margin-bottom 0
</style>