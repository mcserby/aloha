import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import store from "./store/index.js";
import PrimeVue from 'primevue/config';
import Button from 'primevue/button';
import InputText from "primevue/inputtext";
import Textarea from 'primevue/textarea';
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import RadioButton from 'primevue/radiobutton';
import Chips from 'primevue/chips';
import { Field, Form } from 'vee-validate';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primevue/resources/themes/vela-green/theme.css';
import VueMarkdownIt from 'vue3-markdown-it';

const app = createApp(App);

app.use(router).use(store).use(PrimeVue, {ripple: true}).use(VueMarkdownIt).mount('#app');

app.component('Button', Button)
app.component('Textarea', Textarea);
app.component('Input', InputText);
app.component('Dialog', Dialog);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Radio', RadioButton);
app.component('Chips', Chips)
app.component('Form', Form);
app.component('Field', Field);
