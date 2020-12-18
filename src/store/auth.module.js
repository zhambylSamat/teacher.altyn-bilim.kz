import ApiService from "@/common/api.service.js";
import JwtService from "@/common/jwt.service.js";
import {
  SET_DEFAULT_ACTION,
  LOGIN,
  LOGOUT,
  SET_PASSWORD,
  CHECK_AUTH,
  REFRESH_AUTH,
  CHANGE_PASSWORD,
} from "./actions.type.js";
import {
  SET_DEFAULT_MUTATION,
  SET_AUTH,
  SET_PRE_AUTH,
  SET_USER,
  PURGE_AUTH,
  SET_ERROR,
  SET_WARNING,
} from "./mutations.type";

const defaultState = () => {
  return {
    errors: null,
    warnings: null,
    user: {},
    isAuthenticated: !!JwtService.getToken(),
    isChangePassword: false
  };
};

const state = defaultState();

const getters = {
  currentUser(state) {
    return state.user;
  },
  isAuthenticated(state) {
    return state.isAuthenticated;
  },
  isChangePassword(state) {
    return state.isChangePassword;
  }
};

const actions = {
  [SET_DEFAULT_ACTION](context) {
    context.commit(SET_DEFAULT_MUTATION);
  },
  [LOGIN](context, credentials) {
    return new Promise(resolve => {
      ApiService.post("auth/token/teacher/", credentials)
        .then(response => {
          if (response.status == 200) {
            context.commit(SET_AUTH, response.data);
          } else if (response.status == 202) {
            context.commit(SET_PRE_AUTH, response.data);
          }
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_WARNING, response.data.errors);
          resolve(response);
        });
    });
  },
  [CHANGE_PASSWORD](context, credentials) {
    return new Promise(resolve => {
      ApiService.post("auth/change/password/staff/", credentials)
        .then(response => {
          context.commit(SET_AUTH, response.data);
          resolve(response)
        })
        .catch(({ response }) => {
          context.commit(SET_WARNING, response.data.message);
          resolve(response);
        })
    })
  },
  [LOGOUT](context) {
    context.commit(PURGE_AUTH);
  },
  [SET_PASSWORD](context, credentials) {
    credentials.registration_key = this.state.auth.user.registration_key;
    return new Promise(resolve => {
      ApiService.post("auth/setPassword/", credentials)
        .then(response => {
          context.commit(SET_AUTH, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_WARNING, response.data.errors);
          resolve(response);
        });
    });
  },
  [CHECK_AUTH](context) {
    if (JwtService.getToken()) {
      ApiService.setHeader();
      ApiService.post("auth/token/verify/")
        .then(() => {
          this.dispatch(REFRESH_AUTH);
        })
        .catch(error => {
          if (error.response.status == 401) {
            context.commit(PURGE_AUTH);
          }
        });
    } else {
      context.commit(PURGE_AUTH);
    }
  },
  // [UPDATE_USER](context, credentials) {
  //   var user_pk = this.state.auth.user["pk"];
  //   return new Promise(resolve => {
  //     ApiService.setHeader();
  //     ApiService.put("auth/update/user/" + user_pk + "/", credentials)
  //       .then(response => {
  //         context.commit(SET_USER, response.data);
  //         resolve(response);
  //       })
  //       .catch(response => {
  //         resolve(response);
  //       });
  //   });
  // }
};

const mutations = {
  [SET_DEFAULT_MUTATION](state) {
    Object.assign(state, defaultState());
  },
  [SET_ERROR](state, error) {
    state.errors = error;
  },
  [SET_WARNING](state, warns) {
    state.warnings = warns;
  },
  [SET_AUTH](state, data) {
    state.isAuthenticated = true;
    state.isChangePassword = true;
    state.user = data.user;
    state.errors = {};
    JwtService.saveToken(data.token);
  },
  [SET_PRE_AUTH](state, user){
    state.user = user;
    state.isAuthenticated = false;
    state.isChangePassword = true;
    state.errors = {};
  },
  [SET_USER](state, user) {
    state.user = user;
    state.errors = {};
  },
  [PURGE_AUTH](state) {
    JwtService.destroyToken();
    state.isAuthenticated = false;
    // Object.assign(state, defaultState());
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
