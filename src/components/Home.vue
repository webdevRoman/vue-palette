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

    <LevelsDialog/>
    <Toast position="bottom-right" group="br" />
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import LevelsDialog from '@/components/LevelsDialog.vue'

export default defineComponent({

  name: 'Home',

  components: {
    LevelsDialog
  },

  methods: {
    async onSelectFile(event: any) {
      if (event.files.length > 1) {
        this.$toast.add({severity: 'error', summary: 'Ошибка', detail:'Выберите только один файл', group: 'br', life: 3000})
        return
      }
      await this.$store.dispatch('READ_PALETTE_FROM_FILE', event.files[0])
      this.$store.dispatch('SHOW_LEVELS_DIALOG')
    }
  }

})
</script>

<style scoped lang="stylus">
.home
  display flex
  align-items center
  flex-direction column
  min-height 100vh
  padding 50px 0

  &-title
    margin-bottom 20px

  &-descr
    margin-bottom 75px

  &-options
    display: flex;
    justify-content space-between
    align-items: flex-start

  &-option
    display flex
    justify-content center
    align-items center
    flex-direction column
    min-width 40vw

    &__upload
      margin-bottom 20px
</style>