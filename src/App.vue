<template>
  <div class="app">
    <Home></Home>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import Home from './components/Home.vue'

export default defineComponent({
  name: 'App',
  components: {
    Home
  }
});
</script>

<style lang="stylus">
@import './assets/styles/reset'
@import './assets/styles/main'
@import './assets/styles/primevue'
</style>
