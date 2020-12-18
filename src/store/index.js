import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import auth from "@/store/auth.module.js";
import app from '@/store/modules/app/module.js';
import groupAndLesson from "@/store/groupAndLessons.module.js";
import lessonProgress from "@/store/lessonProgress.module.js";
import materials from "@/store/materials.module.js";
// import user from "@/store/user.module.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    app,
    groupAndLesson,
    lessonProgress,
    materials,
    // user
  },
  plugins: [createPersistedState()]
});
