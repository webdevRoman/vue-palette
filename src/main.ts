import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config'
import FileUpload from 'primevue/fileupload'
import Button from 'primevue/button'

import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

const app = createApp(App).use(PrimeVue, { ripple: true })

app.component('FileUpload', FileUpload)
app.component('Button', Button)

app.mount('#app')
