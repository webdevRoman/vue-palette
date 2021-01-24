<template>
  <div class="app">
    <Home></Home>
    <Levels v-if="false"></Levels>
    <Colormap v-if="false"></Colormap>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import Home from './components/Home.vue'
import Levels from './components/Levels.vue'
import Colormap from './components/Colormap.vue'

export default defineComponent({
  name: 'App',
  components: {
    Home,
    Levels,
    Colormap
  }
});
</script>

<style lang="stylus">
@import './assets/styles/reset'
@import './assets/styles/main'
</style>
