export default {
  props: [
    'item',
    'gallery'
  ],
  components: {
    avatar: require('@/components/avatar/avatar.vue'),
    imageItem: require('@/components/stream/streamImage/item.vue'),
  },
  methods: {
    onImageLoaded(meta) {
      this.$emit('imageLoaded', meta);
    }
  }
};
