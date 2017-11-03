import Vue from 'vue';
export default {
  name: 'category-manager',
  data() {
    return {
      categoryForm:{
        categoryName:'',
        type:'',
        isUse:false,
        commerceChamberId: null,
        identity: null,
        categoryId:null
      },
      rules: {
          categoryName: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
            { max: 4, message: '长度不超过 4 个字符', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择分类类型', trigger: 'change' }
          ]
        },
      typeOptions:[
        {
          value: 'news',
          label: '资讯'
        }, {
          value: 'law',
          label: '法律'
        }, {
          value: 'tec',
          label: '新技术'
        }
      ],
      isNewAdd:true,
      allCategoryLists:[],
      categoriesManagerTitle:'添加分类',
      addCategoryDescription:'分类添加成功',
      categoryApiUrl:`${process.env.apiCham}/category/create`
    }
  },
  computed: {
    chamId() {
      return this.$store.state.route.params.chamId;
    },
    meId() {
      return localStorage.getItem('meId');
    },
  },
  mounted() {
    this.fetchCategory();
  },
  methods: {
    fetchCategory() {
      Vue.$http.get(`${process.env.apiCham}/category/lists`, {
        params: {
          commerceChamberId: this.chamId,
          type:'',
          isAll:1
        }
      }).then((response) => {
        this.allCategoryLists = response.data
      })
    },
    getFilterOptions(typename) {
      let allCategoryList = this.allCategoryLists;
      return allCategoryList.filter((item) => item.type === typename);
    },
    addCategory() {
      this.categoriesManagerTitle="添加分类";
      this.addCategoryDescription='分类添加成功';
      this.categoryApiUrl=`${process.env.apiCham}/category/create`;
      this.categoryForm.categoryName = '';
      this.categoryForm.type = '';
      this.isNewAdd = true;
      this.categoryForm.isUse = false;
    },
    editCategory(id) {
      this.categoriesManagerTitle="修改分类";
      this.addCategoryDescription='分类更新成功';
      this.categoryApiUrl=`${process.env.apiCham}/category/update`;
      let currentCategory = this.allCategoryLists.filter((item)=> item.id === id);
      this.categoryForm.categoryName = currentCategory[0].categoryName;
      this.isNewAdd = false;
      this.categoryForm.isUse = currentCategory[0].isUse?true:false;
      this.categoryForm.categoryId = id;
    },
    deleteCategory(id) {
      this.$confirm('您是否确认删除该分类?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          Vue.$http.delete(`${process.env.apiCham}/category/delete`,{
            params:{
              categoryId:id,
              identity:this.meId
            }
          }).then((response) => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.fetchCategory();
          }).catch((error)=>{
            this.$message({
              type: 'error',
              message: error.response.data.Message
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    submitcategoryForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.categoryForm['commerceChamberId']=this.chamId,
            this.categoryForm['identity']=this.meId,
            Vue.$http.post(this.categoryApiUrl,this.categoryForm).then((response) => {
              this.$notify({
                title: '操作成功',
                message: this.addCategoryDescription,
                type: 'success',
                offset: 88
              });
              this.fetchCategory();
            }).catch((error)=>{
              this.$notify({
                title: '操作失败',
                message: error.response.data.Message,
                type: 'error',
                offset: 88
              });
              }
            )
          } else {
            return false;
          }
        });
      }
  }
};
