export default {
  props: [
    'item',
  ],
  methods: {
    getCover(images) {
      const coverItem = images.filter(item => item.IsIndex === true);
      if (coverItem.length) {
        return coverItem[0].OriginalPath;
      }
      return images[0].OriginalPath;
    }
  }
};
