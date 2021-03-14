import { ComponentCustomProperties } from 'vue'
import { Store } from 'vuex'

declare module '@vue/runtime-core' {
  import {State} from '@/models/State'

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}

// import Store from '@/store'
//
// declare module '@vue/runtime-core' {
//   interface ComponentCustomProperties {
//     $store: Store;
//   }
// }