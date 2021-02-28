<template>
  <div class="home">
    <h2 class="title home-title">Vue Palette</h2>
    <p class="text home-descr">Выберите файл для редактирования палитры или создайте новую палитру.</p>
    <div class="home-options">
      <div class="home-option">
        <FileUpload class="home-option__upload"
                    chooseLabel="Выбрать файл" uploadLabel="Редактировать палитру" :showCancelButton="false"
                    :customUpload="true" @uploader="onSelectFile">
          <template #empty>
            <p>Перетащите файл сюда</p>
          </template>
        </FileUpload>
      </div>
      <div class="home-option">
        <Button label="Создать палитру" icon="pi pi-plus"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {usePaletteService} from '@/use/paletteService'

export default defineComponent({
  name: "Home",

  setup() {
    const { palette, readPaletteFromFile } = usePaletteService()

    const onSelectFile = async (event: any) => {
      await readPaletteFromFile(event.files[0])
    }

    return {
      onSelectFile
    }
  }
})
</script>

<style scoped lang="stylus">
.home
  display flex
  justify-content center
  align-items center
  flex-direction column
  min-height 100vh

  &-title
    margin-bottom 20px

  &-descr
    margin-bottom 50px

  &-options
    display: flex;
    justify-content space-between
    align-items center

  &-option
    display flex
    justify-content center
    align-items center
    flex-direction column
    min-width 40vw

    &__upload
      margin-bottom 20px
</style>