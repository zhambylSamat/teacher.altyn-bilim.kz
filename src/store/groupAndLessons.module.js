import ApiService from "@/common/api.service.js";
import {
  SET_DEFAULT_ACTION,
  REMOVE_ERRORS_ACTION,
  REMOVE_WARNINGS_ACTION,
  REMOVE_SUCCESS_ACTION,

  GET_GROUP_LIST,
  GET_STUDENT_PLAN_BY_PK,
  RESET_IP
} from "./actions.type.js";
import {
  SET_DEFAULT_MUTATION,
  SET_ERROR,
  SET_WARNING,
  SET_SUCCESS,
  REMOVE_ERRORS_MUTATION,
  REMOVE_WARNINGS_MUTATION,
  REMOVE_SUCCESS_MUTATION,

  SET_GROUP_LIST,
  SET_STUDENT_PLAN_BY_PK
} from "./mutations.type";

const defaultState = () => {
  return {
    errors: null,
    warnings: null,
    success: null,
    groups: null,
    studentPlan: null,
  };
};

const state = defaultState();

const getters = {
  getGroupList(state) {
    return state.groups;
  },
  getCurrentStudentPlan(state) {
    return state.studentPlan;
  }
};

const actions = {
  [SET_DEFAULT_ACTION](context) {
    context.commit(SET_DEFAULT_MUTATION);
  },
  [REMOVE_ERRORS_ACTION](context) {
    context.commit(REMOVE_ERRORS_MUTATION);
  },
  [REMOVE_WARNINGS_ACTION](context) {
    context.commit(REMOVE_WARNINGS_MUTATION);
  },
  [REMOVE_SUCCESS_ACTION](context) {
    context.commit(REMOVE_SUCCESS_MUTATION);
  },
  [GET_GROUP_LIST](context) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get("group/lesson/group/list/teacher/")
        .then(response => {
          context.commit(SET_GROUP_LIST, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [GET_STUDENT_PLAN_BY_PK](context, student_plan_pk) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get('group/lesson/student/plan/', student_plan_pk)
        .then(response => {
          context.commit(SET_STUDENT_PLAN_BY_PK, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [RESET_IP]() {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post('group/lesson/reset/group/ip/')
        .then(response => {
          resolve(response);
        })
        .catch(({ response }) => {
          reject(response);
        })
    })
  }
};

const mutations = {
  [SET_DEFAULT_MUTATION](state) {
    Object.assign(state, defaultState());
  },
  [SET_ERROR](state, error) {
    state.errors = error;
  },
  [SET_SUCCESS](state, success) {
    state.success = success;
  },
  [SET_WARNING](state, warning) {
    state.warnings = warning;
  },
  [REMOVE_ERRORS_MUTATION](state) {
    state.errors = {};
  },
  [REMOVE_SUCCESS_MUTATION](state) {
    state.success = [];
  },
  [REMOVE_WARNINGS_MUTATION](state) {
    state.warnings = [];
  },
  [SET_GROUP_LIST](state, groups) {
    state.groups = groups;
  },
  [SET_STUDENT_PLAN_BY_PK](state, student_plan) {
    state.studentPlan = student_plan;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
