import ApiService from "@/common/api.service.js";
import {
  SET_DEFAULT_ACTION,
  REMOVE_ERRORS_ACTION,
  REMOVE_WARNINGS_ACTION,
  REMOVE_SUCCESS_ACTION,

  GET_STUDENTS_TO_SET_ABS,
  SET_GROUP_STUDENT_ABS,
  UPDATE_GROUP_STUDENT_ABS,
  GET_STUDENTS_ABS_LIST,
  GET_STUDENT_ABS_MONTH_LIST,
  GET_EDITABLE_STUDENTS_ABS_LIST,
  SET_STUDENT_PLAN_TUTORIAL,
  SET_STUDENT_PLAN_CLASS_WORK,
  SET_STUDENT_PLAN_HOME_WORK,

  GET_STUDENT_TOPIC_QUIZ_MARK_LIST,
  CREATE_STUDENT_TOPIC_QUIZ_MARK,
  EDIT_STUDENT_TOPIC_QUIZ_MARK,
  REMOVE_STUDENT_TOPIC_QUIZ_MARK,

  GET_STUDENT_TRIAL_TEST,
  CREATE_STUDENT_TRIAL_TEST,
  EDIT_STUDENT_TRIAL_TEST,
  REMOVE_STUDENT_TRIAL_TEST,

  GET_STUDENT_VIDEO_ACTIONS,
  STUDENT_VIDEO_ACTIONS_ACCESS,
  STUDENT_VIDEO_ACTIONS_DENY,
} from "./actions.type.js";
import {
  SET_DEFAULT_MUTATION,
  SET_ERROR,
  SET_WARNING,
  SET_SUCCESS,
  REMOVE_ERRORS_MUTATION,
  REMOVE_WARNINGS_MUTATION,
  REMOVE_SUCCESS_MUTATION,

  SET_STUDENTS_TO_SET_ABS,
  SET_STUDENTS_ABS_LIST,
  SET_STUDENT_ABS_MONTH_LIST,
  
  SET_STUDENT_TOPIC_QUIZ_MARK_LIST,
  CREATE_STUDENT_TOPIC_QUIZ_MARK_MUTATION,
  EDIT_STUDENT_TOPIC_QUIZ_MARK_MUTATION,
  REMOVE_STUDENT_TOPIC_QUIZ_MARK_MUTATION,
  
  GET_STUDENT_TRIAL_TEST_MUTATION,
  ADD_STUDENT_TRIAL_TEST,
  EDIT_STUDENT_TRIAL_TEST_MUTATION,
  REMOVE_STUDENT_TRIAL_TEST_MUTATION,

  SET_STUDENT_VIDEO_ACTIONS,
  STUDENT_VIDEO_ACTIONS_ACCESS_MUTATION,
  STUDENT_VIDEO_ACTIONS_DENY_MUTATION,
} from "./mutations.type";

const defaultState = () => {
  return {
    errors: null,
    warnings: null,
    success: null,
    studentsToABS: null,
    studentsABSList: null,
    studentsABSMonthList: null,
    topicQuizMarks: null,
    trialTests: null,
    studentVideoActions: null,
  };
};

const state = defaultState();

const getters = {
  getStudentsToABS(state) {
    return state.studentsToABS;
  },
  getStudentsABSList(state) {
    return state.studentsABSList;
  },
  getStudentsABSMonthList(state) {
    return state.studentsABSMonthList;
  },
  getTopicQuizMarks(state) {
    return state.topicQuizMarks;
  },
  getTrialTests(state) {
    return state.trialTests;
  },
  getCurrentStudentVideoActions(state) {
    return state.studentVideoActions;
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
  [GET_STUDENTS_TO_SET_ABS](context, group_id) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get("lesson/progress/students/abs/", group_id)
        .then(response => {
          context.commit(SET_STUDENTS_TO_SET_ABS, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [SET_GROUP_STUDENT_ABS](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post('lesson/progress/students/abs/', credentials)
        .then(response => {
          context.commit(SET_STUDENTS_TO_SET_ABS, null);
          context.commit(SET_SUCCESS, response.data.message)
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        })
    });
  },
  [UPDATE_GROUP_STUDENT_ABS](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.put('lesson/progress/students/abs/', credentials)
        .then(response => {
          context.commit(SET_STUDENTS_TO_SET_ABS, null);
          context.commit(SET_SUCCESS, response.data.message)
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        })
    });
  },
  [GET_STUDENTS_ABS_LIST](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get(`lesson/progress/students/abs/list/${credentials.lesson_group_pk}/${credentials.date}/`)
        .then(response => {
          context.commit(SET_STUDENTS_ABS_LIST, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [GET_STUDENT_ABS_MONTH_LIST](context, lesson_group_pk) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get('lesson/progress/students/abs/month/list/', lesson_group_pk)
        .then(response => {
          context.commit(SET_STUDENT_ABS_MONTH_LIST, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [GET_EDITABLE_STUDENTS_ABS_LIST](context, group_student_visit_pk) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get('lesson/progress/students/edit/abs/', group_student_visit_pk)
        .then(response => {
          context.commit(SET_STUDENTS_TO_SET_ABS, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [SET_STUDENT_PLAN_TUTORIAL](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.put(`lesson/progress/student/set/plan/${credentials.topic_plan_pk}/tutorial/${credentials.mark}/`)
        .then(response => {
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        })
    })
  },
  [SET_STUDENT_PLAN_CLASS_WORK](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.put(`lesson/progress/student/set/plan/${credentials.topic_plan_pk}/class_work/${credentials.mark}/`)
        .then(response => {
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        })
    })
  },
  [SET_STUDENT_PLAN_HOME_WORK](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.put(`lesson/progress/student/set/plan/${credentials.topic_plan_pk}/home_work/${credentials.mark}/`)
        .then(response => {
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        })
    })
  },
  [GET_STUDENT_TOPIC_QUIZ_MARK_LIST](context, subject_plan_pk) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get('lesson/progress/student/plan/quiz/list/', subject_plan_pk)
        .then(response => {
          context.commit(SET_STUDENT_TOPIC_QUIZ_MARK_LIST, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [CREATE_STUDENT_TOPIC_QUIZ_MARK](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post('lesson/progress/student/plan/quiz/create/', credentials)
        .then(response => {
          context.commit(CREATE_STUDENT_TOPIC_QUIZ_MARK_MUTATION, response.data.topic_quiz_mark);
          context.commit(SET_SUCCESS, response.data.message);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [EDIT_STUDENT_TOPIC_QUIZ_MARK](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.put(`lesson/progress/student/plan/quiz/edit/${credentials.pk}/`, credentials)
        .then(response => {
          context.commit(EDIT_STUDENT_TOPIC_QUIZ_MARK_MUTATION, response.data.topic_quiz_mark);
          context.commit(SET_SUCCESS, response.message);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    })
  },
  [REMOVE_STUDENT_TOPIC_QUIZ_MARK](context, topic_quiz_mark_id) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.delete(`lesson/progress/student/plan/quiz/delete/${topic_quiz_mark_id}/`)
        .then(response => {
          var data = {
            topic_quiz_mark: response.data.topic_quiz_mark,
            topic_quiz_mark_id: topic_quiz_mark_id
          };
          context.commit(REMOVE_STUDENT_TOPIC_QUIZ_MARK_MUTATION, data);
          context.commit(SET_SUCCESS, response.data.message);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    })
  },
  [GET_STUDENT_TRIAL_TEST](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get(`lesson/progress/student/trial/test/list/${credentials.student_id}/${credentials.subject_id}/`)
        .then(response => {
          context.commit(GET_STUDENT_TRIAL_TEST_MUTATION, response.data);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        })
    });
  },
  [CREATE_STUDENT_TRIAL_TEST](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post('lesson/progress/student/trial/test/create/', credentials)
        .then(response => {
          context.commit(ADD_STUDENT_TRIAL_TEST, response.data.trial_test_mark);
          context.commit(SET_SUCCESS, response.data.message);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        })
    });
  },
  [EDIT_STUDENT_TRIAL_TEST](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.put(`lesson/progress/student/trial/test/edit/${credentials.pk}/`, credentials)
        .then(response => {
          context.commit(EDIT_STUDENT_TRIAL_TEST_MUTATION, response.data.trial_test_mark);
          context.commit(SET_SUCCESS, response.data.message);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        })
    })
  },
  [REMOVE_STUDENT_TRIAL_TEST](context, trial_test_mark_id) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.delete(`lesson/progress/student/trial/test/delete/${trial_test_mark_id}/`)
        .then(response => {
          var data = {
            trial_test_mark: response.data.trial_test_mark,
            trial_test_mark_id: trial_test_mark_id
          };
          context.commit(REMOVE_STUDENT_TRIAL_TEST_MUTATION, data);
          context.commit(SET_SUCCESS, response.data.message);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        })
    });
  },
  [GET_STUDENT_VIDEO_ACTIONS](context, student_user_id) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.get(`lesson/progress/student/video/action/list/${student_user_id}/`)
        .then(response => {
          context.commit(SET_STUDENT_VIDEO_ACTIONS, response.data);
          resolve(reject);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data)
          reject(response);
        })
    })
  },
  [STUDENT_VIDEO_ACTIONS_ACCESS](context, credentials) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.post(`lesson/progress/student/video/action/set/${credentials.lesson_group_student_id}/${credentials.topic_id}/`)
        .then(response => {
          context.commit(STUDENT_VIDEO_ACTIONS_ACCESS_MUTATION, response.data.video_action);
          context.commit(SET_SUCCESS, response.data.message);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        });
    });
  },
  [STUDENT_VIDEO_ACTIONS_DENY](context, lesson_video_action_pk) {
    return new Promise((resolve, reject) => {
      ApiService.setHeader();
      ApiService.delete(`lesson/progress/student/video/action/delete/${lesson_video_action_pk}/`)
        .then(response => {
          context.commit(STUDENT_VIDEO_ACTIONS_DENY_MUTATION, lesson_video_action_pk);
          context.commit(SET_WARNING, response.data.message);
          resolve(response);
        })
        .catch(({ response }) => {
          context.commit(SET_ERROR, response.data);
          reject(response);
        })
    })
  },
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
  [SET_STUDENTS_TO_SET_ABS](state, data) {
    state.studentsToABS = data;
  },
  [SET_STUDENTS_ABS_LIST](state, data) {
    state.studentsABSList = data;
  },
  [SET_STUDENT_ABS_MONTH_LIST](state, data) {
    state.studentsABSMonthList = data;
  },
  [SET_STUDENT_TOPIC_QUIZ_MARK_LIST](state, date) {
    state.topicQuizMarks = date;
  },
  [CREATE_STUDENT_TOPIC_QUIZ_MARK_MUTATION](state, topic_quiz_mark) {
    for (let i = 0; i < state.topicQuizMarks.quiz.length; i++) {
      for (let j = state.topicQuizMarks.quiz[i].topic_quiz.length - 1; j >= 0; j--) {
        if (state.topicQuizMarks.quiz[i].topic_quiz[j].topic_plan == topic_quiz_mark.topic_plan
          && state.topicQuizMarks.quiz[i].topic_quiz[j].pk == undefined) {
          state.topicQuizMarks.quiz[i].topic_quiz[j] = topic_quiz_mark;
          break;
        }
      }
    }
  },
  [EDIT_STUDENT_TOPIC_QUIZ_MARK_MUTATION](state, topic_quiz_mark) {
    for (let i = 0; i < state.topicQuizMarks.quiz.length; i++) {
      for (let j = state.topicQuizMarks.quiz[i].topic_quiz.length - 1; j >= 0; j--) {
        if (state.topicQuizMarks.quiz[i].topic_quiz[j].pk == topic_quiz_mark.pk) {
          state.topicQuizMarks.quiz[i].topic_quiz[j] = topic_quiz_mark;
          break;
        }
      }
    }
  },
  [REMOVE_STUDENT_TOPIC_QUIZ_MARK_MUTATION](state, data) {
    for (let i = 0; i < state.topicQuizMarks.quiz.length; i++) {
      for (let j = state.topicQuizMarks.quiz[i].topic_quiz.length - 1; j >= 0; j--) {
        if (state.topicQuizMarks.quiz[i].topic_quiz[j].pk == data.topic_quiz_mark_id) {
          state.topicQuizMarks.quiz[i].topic_quiz[j] = data.topic_quiz_mark;
          break;
        }
      }
    }
  },
  [GET_STUDENT_TRIAL_TEST_MUTATION](state, trial_test_mark) {
    state.trialTests = trial_test_mark;
  },
  [ADD_STUDENT_TRIAL_TEST](state, trial_test_mark) {
    for (let i = state.trialTests.trial_test_marks.length - 1; i >= 0 ; i--) {
      if (state.trialTests.trial_test_marks[i].trial_test == trial_test_mark.trial_test) {
        state.trialTests.trial_test_marks[i] = trial_test_mark;
        break;
      }
    }
  },
  [EDIT_STUDENT_TRIAL_TEST_MUTATION](state, trial_test_mark) {
    for (let i = 0; i < state.trialTests.trial_test_marks.length; i++) {
      if (state.trialTests.trial_test_marks[i].pk == trial_test_mark.pk) {
        state.trialTests.trial_test_marks[i] = trial_test_mark;
        break;
      }
    }
  },
  [REMOVE_STUDENT_TRIAL_TEST_MUTATION](state, data) {
    for (let i = state.trialTests.trial_test_marks.length - 1; i >= 0; i--) {
      if (state.trialTests.trial_test_marks[i].pk == data.trial_test_mark_id) {
        state.trialTests.trial_test_marks[i] = data.trial_test_mark;
        break;
      }
    }
  },
  [SET_STUDENT_VIDEO_ACTIONS](state, video_action_list) {
    state.studentVideoActions = video_action_list;
  },
  [STUDENT_VIDEO_ACTIONS_ACCESS_MUTATION](state, video_action) {
    var changed = false;
    for (let i = 0; i < state.studentVideoActions.length; i++) {
      if (state.studentVideoActions[i].lesson_group_student == video_action.lesson_group_student
        && state.studentVideoActions[i].topic == video_action.topic) {
        state.studentVideoActions[i] = video_action;
        changed = true;
        break;    
      }
    }
    if (!changed) {
      state.studentVideoActions.push(video_action);
    }
  },
  [STUDENT_VIDEO_ACTIONS_DENY_MUTATION](state, lesson_video_action_pk) {
    var tmp = [];
    state.studentVideoActions.forEach(elem => {
      if (elem.pk != lesson_video_action_pk) {
        tmp.push(elem);
      }
    });
    state.studentVideoActions = tmp;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
