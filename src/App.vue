<template>
  <Levels></Levels>
  <Colormap></Colormap>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Levels from './components/Levels.vue'
import Colormap from './components/Colormap.vue'

export default defineComponent({
  name: 'App',
  components: {
    Levels,
    Colormap
  }
});
</script>

<style lang="stylus">
@import './assets/styles/reset'
@import './assets/styles/main'
</style>
