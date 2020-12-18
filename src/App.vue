<template>
  <v-app>
    <div v-if='isAuthenticated'>
      <v-app>
        <core-toolbar />

        <core-drawer />

        <core-view />
      </v-app>
    </div>
    <div v-else>
      <router-view></router-view>
    </div>
  </v-app>
</template>

<script>

import { mapGetters } from "vuex";

export default {
  name: "App",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["isAuthenticated"]),
  },
  created() {
    if (!this.isAuthenticated) {
      this.$router.push({ name: "login" });
    }
  }
};
</script>
