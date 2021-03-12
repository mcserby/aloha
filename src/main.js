import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import store from "./store/index.js";
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import InputText from "primevue/inputtext";
import Textarea from 'primevue/textarea';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primevue/resources/themes/vela-green/theme.css';

const app = createApp(App);

app.use(router).use(store).use(PrimeVue, {ripple: true}).mount('#app');

app.component('Button', Button)
app.component('Textarea', Textarea);
app.component('Input', InputText)
