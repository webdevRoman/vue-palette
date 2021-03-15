import { createApp } from 'vue'

import App from './App.vue'
import store from './store'

import PrimeVue from 'primevue/config'
import FileUpload from 'primevue/fileupload'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ColorPicker from 'primevue/colorpicker'

import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

const app = createApp(App).use(store).use(PrimeVue, { ripple: true })

app.component('FileUpload', FileUpload)
app.component('Button', Button)
app.component('Dialog', Dialog)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('ColorPicker', ColorPicker)

app.mount('#app')
