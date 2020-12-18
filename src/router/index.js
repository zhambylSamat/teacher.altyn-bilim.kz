import Vue from 'vue';
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  // base: process.env.BASE_URL,
  base: '/teacher',
  routes: [
    {
      path: "/",
      component: () => import("@/views/Groups.vue"),
      meta: {
        title: 'Группалар тізімі'
      },
      children: [
        {
          path: "",
          name: "groups",
          meta: {
            title: 'Группалар тізімі'
          },
          component: () => import("@/models/groups/groups.vue")
        },
        {
          path: "groups/",
          meta: {
            title: 'Группалар тізімі'
          },
          component: () => import("@/models/groups/groups.vue")
        }
      ]
    },
    {
      path: "/login",
      meta: {
        title: 'Порталға кіру'
      },
      component: () => import("@/views/Auth.vue"),
      children: [
        {
          path: "",
          name: "login",
          meta: {
            title: 'Порталға кіру'
          },
          component: () => import("@/models/auth/login.vue")
        },
        {
          path: "change/password/",
          name: "changePassword",
          metha: {
            title: "Парольді ауыстыру"
          },
          component: () => import("@/models/auth/changePassword.vue")
        }
      ]
    },
    {
      path: "/current_group",
      component: () => import("@/views/CurrentGroup.vue"),
      meta: {
        title: 'Current Groups'
      },
      children:[
        {
          path: "",
          name: "homePage",
          meta: {
            title: 'Current Groups'
          },
          component: () => import("@/models/currentGroup/currentGroup.vue")
        }
      ]
    },
    {
      path: "/subject/quiz",
      component: () => import("@/views/SubjectQuiz.vue"),
      meta: {
        title: 'Аралық бақылау'
      },
      children: [
        {
          path: "",
          name: "Аралық бақылау",
          meta: {
            title: 'Аралық бақылау | Группалар тізімі'
          },
          component: () => import("@/models/subject_quiz/quiz.vue")
        }
      ]
    },
    {
      path: "/trial/test",
      component: () => import('@/views/TrialTest.vue'),
      meta: {
        title: "Пробный тест"
      },
      children: [
        {
          path: "",
          name: "Пробный тест",
          meta: {
            title: "Пробный тест | Группалар тізімі"
          },
          component: () => import('@/models/trial_test/trialTest.vue')
        }
      ]
    },
    {
      path: "/*",
      component: () => import("@/views/PageNotFound.vue")
    }
  ]
});
