<template>
  <v-dialog v-model='dialog' persistent scrollable max-width="60%">
    <v-card v-if='dialog'>
      <v-card-title>
        <span class='headline'>Оқушының жоспары | {{ user_info.last_name }} {{ user_info.first_name }}</span>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" class='headline font-weight-black' text @click="closeDialog()">X</v-btn>
      </v-card-title>
      <v-card-title>
        <v-spacer></v-spacer>
        <v-btn color='success' @click='selectedPlan(student_plan_pk)'>OK</v-btn>
      </v-card-title>
      <v-card-text>
        <v-divider></v-divider>
        <div v-if='loading_on_fetch_student_plan' class='text-center'>
          <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
        </div>
        <div v-else-if="plans != null">
          <v-container>
            <v-row>
              <v-col cols='12'>
                <v-data-iterator
                  :items="plans"
                  :items-per-page="-1"
                  :hide-default-footer="true"
                  style="width: 100% !important;"
                  class="plan">
                  <template v-slot:default="props">
                    <v-container>
                      <v-row>
                        <v-col cols='12' v-for="chapter in props.items" :key="chapter.pk">
                          <v-card>
                            <template v-if="!chapter.is_endpoint">
                              <v-card-title class='subtitle-1'>{{ chapter.title }}</v-card-title>
                              <v-divider></v-divider>
                            </template>
                            <v-list dense class='py-0' height='25px'>
                              <v-list-item>
                                <v-list-item-content class="font-weight-medium grey--text text--lighten-1"></v-list-item-content>
                                <v-list-item-content class='font-weight-medium grey--text text--lighten-1'>
                                  <v-row>
                                    <v-col cols='12' md='4' sm='4' xs='4' class='py-0 pb-3 text-center'>Видео</v-col>
                                    <v-col cols='12' md='4' sm='4' xs='4' class='py-0 pb-3 text-center'>Сынып ж.</v-col>
                                    <v-col cols='12' md='4' sm='4' xs='4' class='py-0 pb-3 text-center'>Үй ж.</v-col>
                                  </v-row>
                                </v-list-item-content>
                              </v-list-item>
                            </v-list>
                            <template v-if='!chapter.is_endpoint'>
                              <v-list dense v-for="topic in chapter.topics" :key="topic.pk+'|'+chapter.pk" class='py-0'>
                                <v-list-item :class="{'green accent-2' : (topic.tutorial == '1.0' && topic.class_work == '1.0' && topic.home_work == '1.0')}">
                                  <v-list-item-content class='py-0'>{{ topic.title }}</v-list-item-content>
                                  <v-list-item-content class='py-0'>
                                    <v-row>
                                      <v-col cols='12' md='4' sm='4' xs='4'
                                        :class="{'green accent-2': topic.tutorial == '1.0',
                                                'orange lighten-3': topic.tutorial == '0.5'}"
                                        class='text-center'>
                                        <v-btn v-if="topic.tutorial == '0.0'" color='error' @click='setTutorial(topic, 0.5)' :loading='topic.is_tutorial_loading'>0</v-btn>
                                        <v-btn v-if="topic.tutorial == '0.5'" color='warning' @click='setTutorial(topic, 1)' :loading='topic.is_tutorial_loading'>0.5</v-btn>
                                        <v-btn v-if="topic.tutorial == '1.0'" color='success' @click='setTutorial(topic, 0)' :loading='topic.is_tutorial_loading'><v-icon>mdi-check-bold</v-icon></v-btn>
                                      </v-col>
                                      <v-col cols='12' md='4' sm='4' xs='4'
                                        :class="{'green accent-2': topic.class_work == '1.0',
                                                'orange lighten-3': topic.class_work == '0.5'}"
                                        class='text-center'>
                                        <v-btn v-if="topic.class_work == '0.0'" color='error' @click='setClassWork(topic, "0.5")' :loading='topic.is_class_work_loading'>0</v-btn>
                                        <v-btn v-if="topic.class_work == '0.5'" color='warning' @click='setClassWork(topic, "1.0")' :loading='topic.is_class_work_loading'>0.5</v-btn>
                                        <v-btn v-if="topic.class_work == '1.0'" color='success' @click='setClassWork(topic, "0.0")' :loading='topic.is_class_work_loading'><v-icon>mdi-check-bold</v-icon></v-btn>
                                      </v-col>
                                      <v-col cols='12' md='4' sm='4' xs='4'
                                        :class="{'green accent-2': topic.home_work == '1.0',
                                                'orange lighten-3': topic.home_work == '0.5'}"
                                        class='text-center'>
                                        <v-btn v-if="topic.home_work == '0.0'" color='error' @click='setHomeWork(topic, "0.5")' :loading='topic.is_home_work_loading'>0</v-btn>
                                        <v-btn v-if="topic.home_work == '0.5'" color='warning' @click='setHomeWork(topic, "1.0")' :loading='topic.is_home_work_loading'>0.5</v-btn>
                                        <v-btn v-if="topic.home_work == '1.0'" color='success' @click='setHomeWork(topic, "0.0")' :loading='topic.is_home_work_loading'><v-icon>mdi-check-bold</v-icon></v-btn>
                                      </v-col>
                                    </v-row>
                                  </v-list-item-content>
                                </v-list-item>
                              </v-list>
                            </template>
                            <template v-else>
                              <v-list dense class='py-0'>
                                <v-list-item :class="{'green accent-2' : (chapter.tutorial == '1.0' && chapter.class_work == '1.0' && chapter.home_work == '1.0')}">
                                  <v-list-item-content class='py-0'>{{ chapter.title }}</v-list-item-content>
                                  <v-list-item-content class='py-0'>
                                    <v-row>
                                      <v-col cols='12' md='4' sm='4' xs='4'
                                        :class="{'green accent-2': chapter.tutorial == '1.0',
                                                'orange lighten-3': chapter.tutorial == '0.5'}"
                                        class='text-center'>
                                        <v-btn v-if="chapter.tutorial == '0.0'" color='error' @click='setTutorial(chapter, "0.5")' :loading='chapter.is_tutorial_loading'>0</v-btn>
                                        <v-btn v-if="chapter.tutorial == '0.5'" color='warning' @click='setTutorial(chapter, "1.0")' :loading="chapter.is_tutorial_loading">0.5</v-btn>
                                        <v-btn v-if="chapter.tutorial == '1.0'" color='success' @click='setTutorial(chapter, "0.0")' :loading="chapter.is_tutorial_loading"><v-icon>mdi-check-bold</v-icon></v-btn>
                                      </v-col>
                                      <v-col cols='12' md='4' sm='4' xs='4'
                                        :class="{'green accent-2': chapter.class_work == '1.0',
                                                'orange lighten-3': chapter.class_work == '0.5'}"
                                        class='text-center'>
                                        <v-btn v-if="chapter.class_work == '0.0'" color='error' @click='setClassWork(chapter, "0.5")' :loading="chapter.is_class_work_loading">0</v-btn>
                                        <v-btn v-if="chapter.class_work == '0.5'" color='warning' @click='setClassWork(chapter, "1.0")' :loading="chapter.is_class_work_loading">0.5</v-btn>
                                        <v-btn v-if="chapter.class_work == '1.0'" color='success' @click='setClassWork(chapter, "0.0")' :loading="chapter.is_class_work_loading"><v-icon>mdi-check-bold</v-icon></v-btn>
                                      </v-col>
                                      <v-col cols='12' md='4' sm='4' xs='4'
                                        :class="{'green accent-2': chapter.home_work == '1.0',
                                                'orange lighten-3': chapter.home_work == '0.5'}"
                                        class='text-center'>
                                        <v-btn v-if="chapter.home_work == '0.0'" color='error' @click='setHomeWork(chapter, "0.5")' :loading="chapter.is_home_work_loading">0</v-btn>
                                        <v-btn v-if="chapter.home_work == '0.5'" color='warning' @click='setHomeWork(chapter, "1.0")' :loading="chapter.is_home_work_loading">0.5</v-btn>
                                        <v-btn v-if="chapter.home_work == '1.0'" color='success' @click='setHomeWork(chapter, "0.0")' :loading="chapter.is_home_work_loading"><v-icon>mdi-check-bold</v-icon></v-btn>
                                      </v-col>
                                    </v-row>
                                  </v-list-item-content>
                                </v-list-item>
                              </v-list>
                            </template>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-container>
                  </template>
                </v-data-iterator>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

import { mapGetters } from "vuex";
import { GET_STUDENT_PLAN_BY_PK,
  GET_FULL_SUBJECT_LIST,
  SET_STUDENT_PLAN_TUTORIAL,
  SET_STUDENT_PLAN_CLASS_WORK,
  SET_STUDENT_PLAN_HOME_WORK
} from "@/store/actions.type.js";

export default {
  data() {
    return {
      dialog: false,
      student_plan_pk: null,
      user_info: null,
      loading_on_fetch_student_plan: false,
      plans: null,
    }
  },
  methods: {
    openDialog(items) {
      this.student_plan_pk = items.student_plan_pk;
      this.user_info = items.user_info;
      this.dialog = true;
      if (this.getSubjects == null) {
        this.fetchFullSubjects().then(() => this.fetchStudentPlanByPk(this.student_plan_pk));
      } else {
        this.fetchStudentPlanByPk(this.student_plan_pk);
      }
    },
    closeDialog() {
      this.student_plan_pk = null;
      this.user_info = null;
      this.student_plan_pk = null;
      this.dialog = false;
    },
    selectedPlan(student_plan_pk) {
      this.$emit('clicked', student_plan_pk);
      this.closeDialog();
    },
    fetchStudentPlanByPk(student_plan_pk) {
      this.loading_on_fetch_student_plan = true;
      this.$store.dispatch(GET_STUDENT_PLAN_BY_PK, student_plan_pk)
        .then(() => {
          this.plans = this.getConfiguredPlans(this.getCurrentStudentPlan, this.getSubjects);
          this.loading_on_fetch_student_plan = false;
        })
        .catch(() => { this.loading_on_fetch_student_plan = false; });
    },
    fetchFullSubjects() {
      this.loading_on_fetch_student_plan = true;
      this.$store.dispatch(GET_FULL_SUBJECT_LIST)
        .then(() => { this.loading_on_fetch_student_plan = false;})
        .catch(() => { this.loading_on_fetch_student_plan = false; });
    },
    getConfiguredPlans(student_plan, subjects) {
      var result = [];
      var tmp_student_plan_topics = {
        subjects: [],
        topics: {},
      };
      student_plan.subject_plan.forEach(elem => {
        tmp_student_plan_topics.subjects.push(elem.subject);
        elem.topic_plan.forEach(item => {
          var tmp_topic = {
            pk: item.pk,
            tutorial: item.tutorial,
            class_work: item.class_work,
            home_work: item.home_work
          };
          tmp_student_plan_topics.topics[item.topic] = tmp_topic;
        });
      });
      subjects.forEach(subject => {
        if (tmp_student_plan_topics.subjects.includes(subject.pk)) {
          subject.topics.forEach(chapter => {
            if (!chapter.is_endpoint && !chapter.is_mid_control) {
              var tmp_chapter = {
                pk: chapter.pk,
                is_endpoint: false,
                title: chapter.title,
                topics: []
              };
              chapter.topics.forEach(topic => {
                if (topic.is_endpoint && !topic.is_mid_control) {
                  var topic_plan = tmp_student_plan_topics.topics[topic.pk]
                  if (topic_plan != undefined) {
                    var tmp_topic = {
                      pk: topic.pk,
                      topic_plan_pk: topic_plan.pk,
                      title: topic.title,
                      tutorial: topic_plan.tutorial,
                      class_work: topic_plan.class_work,
                      home_work: topic_plan.home_work,
                      is_tutorial_loading: false,
                      is_class_work_loading: false,
                      is_home_work_loading: false,
                    };
                    tmp_chapter.topics.push(tmp_topic);
                  }
                } 
              });
              if (tmp_chapter.topics.length > 0) {
                result.push(tmp_chapter);
              }
            } else if (chapter.is_endpoint && !chapter.is_mid_control) {
              var topic_plan = tmp_student_plan_topics.topics[chapter.pk]
              if (topic_plan != undefined) {
                var tmp_topic = {
                  pk: chapter.pk,
                  topic_plan_pk: topic_plan.pk,
                  is_endpoint: true,
                  title: chapter.title,
                  tutorial: topic_plan.tutorial,
                  class_work: topic_plan.class_work,
                  home_work: topic_plan.home_work,
                  is_tutorial_loading: false,
                  is_class_work_loading: false,
                  is_home_work_loading: false,
                };
                result.push(tmp_topic);
              }
            }
          });
        }
      });
      return result;
    },
    setTutorial(topic, mark) {
      topic.is_tutorial_loading = true;
      var credentials = {
        topic_plan_pk: topic.topic_plan_pk,
        mark: mark
      };
      this.$store.dispatch(SET_STUDENT_PLAN_TUTORIAL, credentials)
        .then(() => {
          topic.is_tutorial_loading = false;
          topic.tutorial = mark;
        })
        .catch(() => { topic.is_tutorial_loading = false; this.closeDialod(); })
    },
    setClassWork(topic, mark) {
      topic.is_class_work_loading = true;
      var credentials = {
        topic_plan_pk: topic.topic_plan_pk,
        mark: mark
      };
      this.$store.dispatch(SET_STUDENT_PLAN_CLASS_WORK, credentials)
        .then(() => {
          topic.is_class_work_loading = false;
          topic.class_work = mark;
        })
        .catch(() => { topic.is_class_work_loading = false; this.closeDialod(); })
    },
    setHomeWork(topic, mark) {
      topic.is_home_work_loading = true;
      var credentials = {
        topic_plan_pk: topic.topic_plan_pk,
        mark: mark
      };
      this.$store.dispatch(SET_STUDENT_PLAN_HOME_WORK, credentials)
        .then(() => {
          topic.is_home_work_loading = false;
          topic.home_work = mark;
        })
        .catch(() => { topic.is_home_work_loading = false; this.closeDialod(); })
    }
  },
  computed: {
    ...mapGetters(['getCurrentStudentPlan', 'getSubjects']),
  }
}
</script>

<style>
.plan {
  height: 60vh;
  width: 28vw !important;
  overflow-y: scroll;
}
</style>
