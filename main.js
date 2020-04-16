import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
Vue.prototype.WebUrl = 'https://djsadmin.chinacloudsites.cn/index.php';
Vue.prototype.ImgUrl = 'https://djsadmin.chinacloudsites.cn/';

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
