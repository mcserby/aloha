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
import ConfirmPopup from 'primevue/confirmpopup';
import RadioButton from 'primevue/radiobutton';
import ConfirmationService from 'primevue/confirmationservice';
import Checkbox from 'primevue/checkbox';
import Chips from 'primevue/chips';
import Calendar from 'primevue/calendar';
import ContextMenu from 'primevue/contextmenu';
import { Field, Form } from 'vee-validate';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primevue/resources/themes/vela-green/theme.css';
import VueMarkdownIt from 'vue3-markdown-it';
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";

const app = createApp(App);

app
    .use(router)
    .use(store)
    .use(PrimeVue, {ripple: true})
    .use(VueMarkdownIt)
    .use(ConfirmationService)
    .use(ToastService)
    .mount('#app');

app.component('Button', Button)
app.component('Textarea', Textarea);
app.component('Input', InputText);
app.component('Dialog', Dialog);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Radio', RadioButton);
app.component('Chips', Chips);
app.component('Checkbox', Checkbox);
app.component('Form', Form);
app.component('Field', Field);
app.component('Calendar', Calendar);
app.component('PopUp', ConfirmPopup);
app.component('Toast', Toast);
app.component('ContextMenu', ContextMenu);
