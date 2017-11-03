import Vue from 'vue';

export default {
  data() {
    return {
      images: []
    }
  },
  props:['status'],
  mounted() {
    this.fetchImageList();
  },
  methods: {
    fetchImageList() {
      const meId = localStorage.getItem('meId');
      Vue.$http.get(`${process.env.apiCham}/imgManager/getImage`, {
        params: {
          identity: meId,
          singlePage: 300
        }
      }).then((response) => {
        this.images = response.data;
      });
    },
    insertImage(image) {
      $('#froala-editor').froalaEditor('image.insert', image.url);
      this.$emit('insertImageDone');
    },
    preDeleteImage(imageId) {
      this.$confirm('此操作将从图库中移除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteImage(imageId)
      })
    },
    deleteImage(imageId) {
      const meId = localStorage.getItem('meId');
      Vue.$http.delete(`${process.env.apiCham}/imgManager/deleteImage`, {
        params: {
          imageId: imageId,
          identity: meId
        }
      }).then((response) => {
        this.images = this.images.filter(image => image.id !== imageId);
      });
    }
  },
  watch: {
    status(nVal, oVal) {
      if (nVal) {
        this.fetchImageList();
      }
    }
  }
};
