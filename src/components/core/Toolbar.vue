<template>
  <v-app-bar
    id="core-toolbar"
    app
    flat
    prominent
    height='73'
    style="background: #eee;"
  >
    <v-toolbar
      style="background: #eee;"
      flat
      class="tertiary--text font-weight-light"
    >
      <v-app-bar-nav-icon @click.stop="onClickBtn" ></v-app-bar-nav-icon> <!-- v-if="responsive" -->
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer />
      <v-btn class='mr-3' color='info' :loading="loading.on_resetting_ip" @click="resetIp()">Обновить IP</v-btn>
      <v-btn outlined color='indigo' @click="logout">Шығу</v-btn>
    </v-toolbar>
  </v-app-bar>
</template>

<script>

import { mapMutations } from 'vuex';
import { LOGOUT, SET_DEFAULT_ACTION, RESET_IP } from "@/store/actions.type.js";

export default {
  data: () => ({
    title: null,
    responsive: false,
    loading: {
      on_resetting_ip: false
    }
  }),

  watch: {
    '$route' (val) { 
      this.title = val.meta.title;
    }
  },

  mounted () {
    this.onResponsiveInverted()
    window.addEventListener('resize', this.onResponsiveInverted)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResponsiveInverted)
  },

  methods: {
    ...mapMutations(['setDrawer', 'toggleDrawer']),
    onClickBtn () {
      this.setDrawer(!this.$store.state.app.drawer);
    },
    onResponsiveInverted () {
      if (window.innerWidth < 991) {
        this.responsive = true
      } else {
        this.responsive = false
      }
    },
    logout() {
      this.$store.dispatch(SET_DEFAULT_ACTION);
      this.$store.dispatch(LOGOUT).then(() => {
        this.$router.push({ name: "login" });
      });
    },
    resetIp() {
      this.loading.on_resetting_ip = true;
      this.$store.dispatch(RESET_IP)
        .then(() => { this.loading.on_resetting_ip = false; })
        .catch(() => { this.loading.on_resetting_ip = false; });
    }
  }
}
</script>

<style>
  #core-toolbar a {
    text-decoration: none;
  }
</style>
