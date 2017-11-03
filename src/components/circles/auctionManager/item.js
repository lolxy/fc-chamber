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
      auctionForm: {
        Qty: 1,
        Unit: '',
        StartPrice: null,
        EndTime: '',
        ContacterId: null,
        Title: '',
        CategoryIds: '',
        PublisherId: null,
        Description: '',
        Images: [],
        Attachments: []
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
      },
      currentTypes: {},
      employees: [],
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
      this.auctionForm.ContacterId = this.employees[0].Id;
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
      if (this.auctionForm.Images) {
        this.auctionForm.Images.push(img);
      }
    },
    removeCover(image) {
      this.$confirm('确定移除该图片?', '提示', {
        confirmButtonText: '确定移除',
        cancelButtonText: '暂不移除',
        type: 'error'
      }).then(() => {
        this.auctionForm.Images = this.auctionForm.Images.filter(item => item !== image);
      });
    },
    onSubmit() {
      const catIds = Object.values(this.currentTypes);
      const date = `${this.date.date1.toDateString()} ${this.date.date2.toTimeString()}`;
      this.auctionForm.CategoryIds = catIds;
      this.auctionForm.EndTime = new Date(date).toISOString();
      this.auctionForm.PublisherId = this.meId;
      if (!this.auctionForm.ContacterId) {
        this.auctionForm.ContacterId = this.meId;
      }

      Vue.$http.post('../v1/Auctions?fields=CurrPrice,Publisher,Images,Company', this.auctionForm).then((response) => {
        this.$emit('auctionManagerUpdate', response.data);
      })
    }
  }
};
