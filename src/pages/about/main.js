import Vue from 'vue';
import VueAMap from 'vue-amap';
Vue.use(VueAMap);

VueAMap.initAMapApiLoader({
  key: 'a61c730af9a56dd7e9823e32c4926249',
  plugin: ['AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType']
});

export default {
  name: 'about',
  data() {
    return {
      chamInfo:[],
      chamMap: {}
    }
  },
  computed:{
    chamId() {
      return this.$store.state.route.params.chamId;
    }
  },
  mounted() {
    this.fetchChamberAbout();
  },
  methods: {
    fetchChamberAbout() {
      Vue.$http.get(`${process.env.apiCham}/commerceChamber/getCommerceChamberDetail`, {
        params:{
          commerceChamberId: this.chamId
        }
      }).then((response)=>{
        this.chamInfo = response.data;
        this.initChamMap();
      });
    },
    initChamMap() {
      this.chamMap = {
        zoom: 8,
        center: [this.chamInfo.longitude, this.chamInfo.latitude],
        plugin: [{
          pName: 'ToolBar'
        }],
        maker: {
          events: {
            click: () => {
              this.chamMap.window.visible = !this.chamMap.window.visible;
            }
          }
        },
        window: {
          position: [this.chamInfo.longitude, this.chamInfo.latitude],
          content: this.chamInfo.name,
          visible: false
        }
      }
    }
  }
}
