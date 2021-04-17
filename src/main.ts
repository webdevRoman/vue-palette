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
import InputNumber from 'primevue/inputnumber'
import Checkbox from 'primevue/checkbox'
import ToastService from 'primevue/toastservice'
import Toast from 'primevue/toast'

import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

const app = createApp(App).use(store).use(PrimeVue, { ripple: true }).use(ToastService);

app.component('FileUpload', FileUpload)
app.component('Button', Button)
app.component('Dialog', Dialog)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('ColorPicker', ColorPicker)
app.component('InputNumber', InputNumber)
app.component('Checkbox', Checkbox)
app.component('Toast', Toast)

app.mount('#app')