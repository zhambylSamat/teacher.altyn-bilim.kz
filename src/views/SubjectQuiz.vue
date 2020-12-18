<!-- eslint-disable -->
<template>
  <v-app class="subject-quiz">
    <alert-error :errs="errs" />
      <alert-warning :warn="warns" />
      <alert-success :success="success"/>
    <router-view></router-view>
  </v-app>
</template>
<!-- eslint-enable -->

<script>
import { mapGetters, mapState } from "vuex";
export default {
  name: "subject-quiz",
  computed: {
    ...mapGetters(["isAuthenticated"]),
    ...mapState({
      errs: state => state.lessonProgress.errors,
      warns: state => state.lessonProgress.warnings,
      success: state => state.lessonProgress.success,
    })
  },
};
</script>
