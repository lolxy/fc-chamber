/* ============
 * Chat msg Item
 * ============
 *
 */
import Vue from 'vue';
import store from '@/store';
import APlayer from '@/assets/js/vue-aplayer';
import Emoji from '@/services/emoji';

export default {
  props: [
    'sid',
    'className',
    'message',
    'gallery'
  ],
  components: {
    chatMsgItemCustom: require('@/components/contact/chatMsgItemCustom/item.vue'),
    APlayer,
  },
  methods: {
    stripMetaUrl(url) {
      return window.nim.viewImageStripMeta({
        url: url,
        strip: true
      });
    },
    formatText(text) {
      let textContent = text.replace(/(?:\r\n|\r|\n)/g, '<br />');
      textContent = Emoji.buildEmoji(textContent);
      return textContent;
    },
    customMessage(message) {
      const content = JSON.parse(message.content.replace(/,\r\n\s*}/g, '}'));
      return this.jsonLowerKeys(content);
    },
    jsonLowerKeys(content) {
      var ret={};
      $.map(content,function(value,key){
        ret[key.toLowerCase()]=value;
      })
      return ret;
    },
    addTeamMembersNotifyMsg(users) {
      const members = _.reverse(users);
      const names = [];
      let nicks = '';
      _.forEach(members, (member, index) => {
        if (index !== 0) {
          names.push(member.nick);
        }
      });
      nicks = _.join(names, '、');
      return `【${members[0].nick}】邀请【${nicks}】加入了群聊`;
    },
    findImageIndex(imgSrc) {
      return _.findIndex(this.gallery, ['src', imgSrc]);
    },
    galleryOptions(pid) {
      return {
        shareEl: false,
        showHideOpacity: true,
        getThumbBoundsFn() {
          let thumbnail = $(`#${pid}`);
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
          let rect = thumbnail[0].getBoundingClientRect();
          return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
        }
      }
    },
  }
};
