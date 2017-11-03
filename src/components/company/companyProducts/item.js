/* ============
 * Stream Item
 * ============
 *
 */
import Vue from 'vue';
import store from '@/store';
import infiniteLoading from 'vue-infinite-loading';
import VueDND from 'awe-dnd';
Vue.use(VueDND);

export default {
  data() {
    return {
      products: [],
      currentPage: 0,
      productsOrderable: false,
      productsLoaded: false,
      editDialogVisible: false,
      editDialogTitle: '编辑产品',
      editDialogMode: 'modify',
      currentProductItem: {},
      coverEditor: {
        upToken: null,
        isUploadShow: false,
        supportWebp: false,
        bucketHost: `${process.env.qiniuBucketHost}`,
        imageData: {}
      },
      maxImageLength: 9,
      currentImageIndex: 0,
      allEmployeeRoles:[],
      allRoleList:{}
    }
  },
  components: {
    infiniteLoading,
    placeholder: require('@/components/placeholder/item.vue'),
  },
  computed: {
    currentImages() {
      return this.currentProductItem.Images.reverse();
    },
    companyId() {
      return this.$store.state.route.params.id;
    },
    userId() {
      return localStorage.getItem('userId');
    },
    uploaderVisible() {
      if (this.currentProductItem.Images) {
        return this.currentProductItem.Images.length < this.maxImageLength
      }
      return true;
    },
    formatAllEmployeeRoles(){
      if(this.allEmployeeRoles.length){
        this.allEmployeeRoles.forEach((item)=>{
          Vue.set(this.allRoleList,`${item.Code}`,_.map(item.Employees,(item)=>{
            return {
              'UserId':item.UserId
            }
          }));
        });
      }
      return this.allRoleList;
    }
  },
  mounted() {
    this.fetchRoles();
    this.$dragging.$on('dragged', ({ value }) => {
      if (value.group === 'item.Id' && !this.productsOrderable) {
        this.productsOrderable = true;
      }
    })
  },
  watch:{
    companyId() {
      this.resetCompanyProducts();
      this.fetchRoles();
      this.$dragging.$on('dragged', ({ value }) => {
        if (value.group === 'item.Id' && !this.productsOrderable) {
          this.productsOrderable = true;
        }
      })
    }
  },
  methods: {
    isMyOwnCompany() {
      const userId = localStorage.getItem('userId');
      const currentCompanyId = this.$store.state.route.params.id;
      const myCompany = this.$store.state.myCompanies.list.filter((item) => {
        return item.OwnerId === userId && item.Id === currentCompanyId;
      });
      if (myCompany.length) {
        return true;
      }
      return false;
    },

    fetchRoles() {
      const meId = localStorage.getItem('meId');
      Vue.$http.get('/My/EmployeeRoles',{
        params: {
          meId:meId,
          fields: 'Employees.Roles'
        },
      }).then((response) => {
        this.allEmployeeRoles = response.data;
      });
    },
    getRoles(roles){
      if(this.formatAllEmployeeRoles && this.formatAllEmployeeRoles[roles]){
        const myRoles = this.formatAllEmployeeRoles[roles].filter((item) => {
          return item.UserId === this.userId;
        });
        if (myRoles.length) {
          return true;
        }
      }
      return false;
    },

    fetchCompanyProducts() {
      const companyId = this.$store.state.route.params.id;
      Vue.$http.get(`../v1/Products?CompanyId=${companyId}`, {
        params: {
          fields: 'images',
          take: 12,
          skip: this.currentPage * 12,
        },
      }).then((response) => {
        let products = response.data;

        if (products.length) {
          this.products = this.products.concat(products);
          this.productsLoaded = true;
          this.$refs.productsInfiniteLoading.$emit('$InfiniteLoading:loaded');
          if (products.length < 12) {
            this.$refs.productsInfiniteLoading.$emit('$InfiniteLoading:complete');
          }
          this.currentPage = this.currentPage + 1;
        } else {
          this.$refs.productsInfiniteLoading.$emit('$InfiniteLoading:complete');
        }
      });
    },
    onInfinite() {
      this.fetchCompanyProducts();
    },
    resetCompanyProducts() {
      this.products = [];
      this.currentPage = 0;
      this.productsLoaded = false;
    },
    productCover(images) {
      const cover = images.filter(item => item.IsIndex);
      if (cover.length) {
        return cover[0];
      }
      return {};
    },
    editThisProduct(item) {
      this.editDialogMode = 'modify';
      this.editDialogTitle = '编辑产品';
      this.currentProductItem = item;
      this.editDialogVisible = true;
    },
    createNewProduct() {
      const companyId = this.$store.state.route.params.id;
      const publisherId = localStorage.getItem('meId');

      this.editDialogMode = 'new';
      this.editDialogTitle = '新增产品';
      this.currentProductItem = {
        CompanyId: companyId,
        PublisherId: publisherId,
        Name: null,
        Number: null,
        MinPrice: null,
        MaxPrice: null,
        Unit: null,
        Notes: null,
        SortId: 0,
        ContactId: null,
        ContacterIsNull: false,
        Images: [],
        BrandName: null
      }
      this.editDialogVisible = true;
    },
    saveThisProductInfo(mode) {
      const hasCoverImage = this.currentProductItem.Images.filter(item => item.IsIndex === true);
      if (this.currentProductItem.Images.length && !hasCoverImage.length) {
        this.currentProductItem.Images[0].IsIndex = true;
      }
      Vue.$http.post('../v1/Products?fields=Images', this.currentProductItem).then((response) => {
        this.editDialogVisible = false;
        if (mode === 'new') {
          this.products.push(response.data);
        }
      });
    },
    cancelSaveProductInfo() {
      this.editDialogVisible = false;
    },
    beforeUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (this.currentProductItem.Images.length < this.maxImageLength && this.currentImageIndex < this.maxImageLength) {
        if (isLt2M) {
          const prefix = new Date().getTime();
          const lastModified = file.lastModified;
          const suffix = file.name.split('.').pop();
          const key = encodeURI(`${prefix}_${lastModified}.${suffix}`);
          this.currentImageIndex += 1;
          return Vue.$http.get('/Qiniu/GetUploadToken').then((response) => {
            this.coverEditor.upToken = response.data.Token;
            this.coverEditor.imageData = {
              key,
              token: this.coverEditor.upToken
            }
          })
        }
        if (!isLt2M) {
          this.$refs.imageUploader.clearFiles();
          this.$message.error('上传图片大小不能超过 2MB!');
        }
      } else {
        this.imageUploaderStatus = true;
        return false;
      }
    },
    handleSuccess (response, file, fileList) {
      let key = response.key
      let name = file.name
      let prefix = this.coverEditor.supportWebp ? 'webp/' : ''
      let img = {
        OriginalPath: `${this.coverEditor.bucketHost}/${prefix}${encodeURI(key)}`,
        Remark: null
      }
      if (this.currentProductItem.Images.length < this.maxImageLength) {
        this.currentProductItem.Images.push(img);
      }
    },
    removeCover(image) {
      this.$confirm('确定移除该图片?', '提示', {
        confirmButtonText: '确定移除',
        cancelButtonText: '暂不移除',
        type: 'error'
      }).then(() => {
        this.currentProductItem.Images = this.currentProductItem.Images.filter(item => item !== image);
        this.currentImageIndex -= 1;
      });
    },
    setIndexCover(image) {
      const images = this.currentProductItem.Images.filter(item => item !== image);
      if (images.length) {
        images.forEach((image) => {
          image.IsIndex = false;
        });
      }
      image.IsIndex = true;
    },
    saveProductSort() {
      let productIds = [];
      const publisherId = localStorage.getItem('meId');
      this.products.forEach((item) => {
        productIds.push(item.Id);
      });
      productIds = productIds.join(',');
      Vue.$http.post('../v1/Products/ProductSort', {
        Id: productIds,
        PublisherId: publisherId
      }).then(() => {
        this.productsOrderable = false;
      });
    },
    deleteThisProduct(item) {
      this.$confirm('删除后该产品不可恢复，确定要删除该产品吗?', '注意', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'error'
      }).then(() => {
        Vue.$http.delete(`../v1/Products/${item.Id}`).then(() => {
          this.products = this.products.filter(product => product.Id !== item.Id);
        });
      });
    },
    goTop() {
      window.scrollTo(0,0);
    }
  }
};
