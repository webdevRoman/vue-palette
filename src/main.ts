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
import Dropdown from 'primevue/dropdown'
import Panel from 'primevue/panel'
import Divider from 'primevue/divider'
import RadioButton from 'primevue/radiobutton'

import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/material.css'

const app = createApp(App).use(store).use(PrimeVue, { ripple: true }).use(ToastService)

app.component('FileUpload', FileUpload)
app.component('Button', Button)
app.component('Dialog', Dialog)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('ColorPicker', ColorPicker)
app.component('InputNumber', InputNumber)
app.component('Checkbox', Checkbox)
app.component('Toast', Toast)
app.component('Dropdown', Dropdown)
app.component('Panel', Panel)
app.component('Divider', Divider)
app.component('RadioButton', RadioButton)

app.component('VueSlider', VueSlider)

app.mount('#app')