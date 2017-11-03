/* ============
 * Home Index Page
 * ============
 *
 * The home index page
 */
import Vue from 'vue';
import store from '@/store';
import _ from 'lodash';

export default {
  data() {
    return {
      biddingForm: {
        Qty: 100,
        Unit: '',
        ProductionType: '',
        QuotedPrice: null,
        DeliveryTime: null,
        EndTime: null,
        ContacterId: null,
        Title: null,
        CategoryIds: [],
        PublisherId: null,
        Description: null,
        Images: [],
        Attachments: [],
      },
      coverEditor: {
        upToken: null,
        isUploadShow: false,
        supportWebp: false,
        bucketHost: `${process.env.qiniuBucketHost}`,
        imageData: {}
      },
      date: {
        date1: new Date(),
        date2: new Date(),
        date3: new Date(),
      },
      currentTypes: {},
      employees: []
    };
  },
  props: [
    'types'
  ],
  computed: {
    meId() {
      return localStorage.getItem('meId');
    },
    myCompanyId() {
      return localStorage.getItem('companyId');
    }
  },
  mounted() {
    if (this.types) {
      this.types.forEach((typeItem) => {
        Vue.set(this.currentTypes, `type-${typeItem.Id}`, null);
      })
    }
    this.fetchEmployees();
  },
  methods: {
    fetchEmployees() {
      this.employees = this.$store.state.myIdentities.list.filter(item => item.CompanyId === this.myCompanyId);
      this.biddingForm.ContacterId = this.employees[0].Id;
      Vue.$http.get(`/Employees?CompanyId=${this.myCompanyId}&IsShowInCompanySite=true`).then((response) => {
        this.employees = this.employees.concat(response.data);
      })
    },
    isMuliple(maxSelectCount) {
      if (maxSelectCount === 1) {
        return false;
      }
      return true;
    },
    beforeUpload(file) {
      let prefix = new Date().getTime();
      let suffix = file.name;
      let key = encodeURI(`${prefix}_${suffix}`)
      return Vue.$http.get('/Qiniu/GetUploadToken').then((response) => {
        this.coverEditor.upToken = response.data.Token;
        this.coverEditor.imageData = {
          key,
          token: this.coverEditor.upToken
        }
      })
    },
    handleSuccess(response, file, fileList) {
      let key = response.key
      let name = file.name
      let prefix = this.coverEditor.supportWebp ? 'webp/' : ''
      let img = {
        ImgUri: `${this.coverEditor.bucketHost}/${prefix}${encodeURI(key)}`,
        Intro: null
      }
      if (this.biddingForm.Images) {
        this.biddingForm.Images.push(img);
      }
    },
    removeCover(image) {
      this.$confirm('确定移除该图片?', '提示', {
        confirmButtonText: '确定移除',
        cancelButtonText: '暂不移除',
        type: 'error'
      }).then(() => {
        this.biddingForm.Images = this.biddingForm.Images.filter(item => item !== image);
      });
    },
    onSubmit() {
      const catIds = Object.values(this.currentTypes);
      const date1 = `${this.date.date1.toDateString()} ${this.date.date2.toTimeString()}`;
      const date2 = `${this.date.date3.toDateString()}`;
      this.biddingForm.CategoryIds = catIds;
      this.biddingForm.DeliveryTime = new Date(date2).toISOString();
      this.biddingForm.EndTime = new Date(date1).toISOString();
      this.biddingForm.PublisherId = this.meId;
      if (!this.biddingForm.ContacterId) {
        this.biddingForm.ContacterId = this.meId;
      }

      Vue.$http.post('../v1/Biddings?fields=CurrPrice,Images,Publisher,Company', this.biddingForm).then((response) => {
        this.$emit('biddingManagerUpdate', response.data);
      })
    }
  }
};
