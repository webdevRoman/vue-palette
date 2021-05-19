<template>
  <Dialog class="dialog-levels dialog-xl" header="Линии уровня" v-model:visible="showLevelsDialog"
          modal maximizable :closeOnEscape="false">

    <div class="flex flex-sb">

      <DataTable class="p-datatable-sm flex-75" :value="levels" v-model:selection="selectedLevels" dataKey="value">
        <Column :selectionMode="deleteMode ? 'multiple' : 'none'"
                :style="`width: ${deleteMode ? '60' : '0'}px`"></Column>

        <Column field="value">
          <template #header>
            <Button label="Значение" class="cell cell-header p-button-text p-button-plain" @click="showScaleDialog()"/>
          </template>
          <template #body="{data}">
            <LevelValue :props-level="data"/>
          </template>
        </Column>

        <Column>
          <template #header>
            <Button label="Линия" class="cell cell-header p-button-text p-button-plain" @click="showLinesDialog()"/>
          </template>
          <template #body="{data}">
            <Button class="p-button-text p-button-plain cell" @click="showLineDialog(data)">
              <div class="cell-line"
                   :style="`border-top: ${data.lineWidth}px ${data.lineStyle.toLowerCase()} #${data.lineColor.hex}`">
              </div>
            </Button>
          </template>
        </Column>

        <Column field="fillColor">
          <template #header>
            <Button label="Цвет закраски" class="cell cell-header p-button-text p-button-plain"
                    @click="showColormapDialog()"/>
          </template>
          <template #body="{data}">
            <ColorPicker v-model="data.fillColor.hex" class="cell cell-fill"/>
          </template>
        </Column>
      </DataTable>

      <div class="controls flex-25" v-if="deleteMode">
        <Button label="Подтвердить" @click="deleteLevels()"/>
        <Button label="Отменить" @click="exitDeleteMode()"/>
      </div>
      <div class="controls flex-25" v-else>
        <Button label="Добавить уровень" @click="addLevel()"/>
        <Button label="Удалить уровни" @click="deleteMode = true"/>
        <Button label="Сохранить"/>
      </div>

    </div>

    <ScaleDialog/>
    <LineDialog/>
    <LinesDialog/>
    <ColormapDialog/>
  </Dialog>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {LineStyles} from '@/models/LineStyles'
import {Level} from '@/models/Level'
import LevelValue from '@/components/LevelValue.vue'
import ScaleDialog from '@/components/ScaleDialog.vue'
import LineDialog from '@/components/LineDialog.vue'
import LinesDialog from '@/components/LinesDialog.vue'
import ColormapDialog from '@/components/ColormapDialog.vue'
import {ColormapInitiators} from '@/models/ColormapInitiators'

export default defineComponent({

  name: 'LevelsDialog',

  components: {
    LevelValue,
    ScaleDialog,
    LineDialog,
    LinesDialog,
    ColormapDialog
  },

  data() {
    return {
      showLevelsDialog: false,
      LineStyles: LineStyles,
      deleteMode: false,
      selectedLevels: null
    }
  },

  methods: {
    addLevel() {
      this.$store.dispatch('ADD_LEVEL')
    },

    exitDeleteMode() {
      this.selectedLevels = null
      this.deleteMode = false
    },

    deleteLevels() {
      this.$store.dispatch('DELETE_LEVELS', this.selectedLevels)
      this.exitDeleteMode()
    },

    showScaleDialog() {
      this.$store.dispatch('SHOW_SCALE_DIALOG')
    },

    showLineDialog(level: Level) {
      this.$store.dispatch('SHOW_LINE_DIALOG', level)
    },

    showLinesDialog() {
      this.$store.dispatch('SHOW_LINES_DIALOG')
    },

    showColormapDialog() {
      this.$store.dispatch('SHOW_COLORMAP_DIALOG', ColormapInitiators.FILLING)
    }
  },

  computed: {
    showStoreLevelsDialog(): boolean {
      return this.$store.getters.showLevelsDialog
    },

    levels(): Level[] {
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
.cell
  width 100%

  &-header
    font-weight 500

  &-line
    width 100%
    height 10px
    margin-top 10px

  &-fill
    transform translateY(-7px)

.controls
  margin-left 20px

  button
    width 100%
    margin-bottom 10px

    &:last-child
      margin-bottom 0
</style>