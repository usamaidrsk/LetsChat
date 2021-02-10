import { mapGetters } from 'vuex'
import { f7, f7ready } from 'framework7-vue';

export const mixin = {
    computed: {
      ...mapGetters({
        alert_message: 'alert_message'
      })
    },
    watch: {
      alert_message(value) {
        const self = this;
        this.showToastBottom(value);
        setTimeout(() => {
          self.$store.commit("setAlertMessage", null);
        }, 200);
      }
    },
    methods: {
      showToastBottom(text) {
        const self = this;
        f7ready(() => {
          // Create toast
          if (!self.toastBottom || self.toastBottom.destroyed) {
            self.toastBottom = f7.toast.create({
              text: text,
              closeTimeout: 3000,
              destroyOnClose: true
            });
          }
          // Open it
          self.toastBottom.open();
        })
      }
    }
  };
  