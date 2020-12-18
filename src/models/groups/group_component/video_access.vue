<template>
  <v-dialog v-model='dialog' scrollable max-width="50%">
    <v-card v-if='student_plan_id != null'>
      <v-card-title>
        {{ user_info.last_name }} {{ user_info.first_name }} | {{ subject_info.title }} | Видео сабаққа доступ ашу 
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" class='headline font-weight-black' text @click="closeDialog()">X</v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols='12'>
              <v-progress-linear v-if="loading.on_fetch_plans" indeterminate color="primary"></v-progress-linear>
              <template v-else-if='plans != null && lesson_group_student_id != null'>
                <v-data-iterator
                  :items="plans"
                  :items-per-page='-1'
                  :hide-default-footer="true">
                  <template v-slot:default='props'>
                    <v-container>
                      <v-row>
                        <v-col cols='12' v-for='chapter in props.items' :key="chapter.pk">
                          <v-card>
                            <template v-if='!chapter.is_endpoint'>
                              <v-card-title class='subtitle-1 cursor-pointer' @click='toggleContent(plans, chapter.pk)'>
                                {{ chapter.title }}
                                <v-spacer></v-spacer>
                                <v-icon v-if="chapter.show" color='info'>mdi-arrow-up-drop-circle-outline</v-icon>
                                <v-icon v-else color='info'>mdi-arrow-down-drop-circle-outline</v-icon>
                              </v-card-title>
                              <v-divider></v-divider>
                              <template v-if='chapter.show'>
                                <v-list dense v-for="topic in chapter.topics" :key="topic.pk+'|'+chapter.pk" class='py-0'>
                                  <v-list-item>
                                    <v-list-item-content class='py-0'>{{ topic.title }}</v-list-item-content>
                                    <v-list-item-content class='py-0'>
                                      <template v-if='topic.has_video'>
                                        <v-row>
                                          <v-col cols='6' md='6' sm='8' xs='8'>
                                            <v-btn v-if="accessExist(topic.pk, lesson_group_student_id)"
                                              small
                                              outlined
                                              block
                                              color='warning'
                                              :loading="topic.loading"
                                              @click='disableVideo(topic.pk, lesson_group_student_id, topic)'>Доступты жабу</v-btn>
                                            <v-btn v-else
                                              small
                                              block
                                              color='success'
                                              @click='enableVideo(lesson_group_student_id, topic.pk, topic)'
                                              :loading="topic.loading">Доступ ашу</v-btn>
                                          </v-col>
                                          <v-col cols='6' md='6' sm='4' xs='4'>
                                            <p v-for="(video, i) in topic.videos" :key='i' class='mb-0'>
                                              <v-icon small color='lime lighten-1'>mdi-timer</v-icon> <span>{{ convertToTime(video.duration) }}</span>
                                            </p>
                                          </v-col>
                                        </v-row>
                                      </template>
                                      <span v-else class='font-italic font-weight-light orange--text'>Видео енгізілмеген</span>
                                    </v-list-item-content>
                                  </v-list-item>
                                  <v-divider></v-divider>
                                </v-list>
                              </template>
                            </template>
                            <template v-else>
                              <v-list dense class='py-0'>
                                <v-list-item>
                                  <v-list-item-content class='py-0'>{{ chapter.title }}</v-list-item-content>
                                  <v-list-item-content class='py-0'>
                                    <template v-if='chapter.has_video'>
                                      <v-row>
                                        <v-col cols='6' md='6' sm='8' xs='8'>
                                          <v-btn v-if="accessExist(chapter.pk, lesson_group_student_id)"
                                            small
                                            outlined
                                            block
                                            color='warning'
                                            :loading="chapter.loading"
                                            @click='disableVideo(chapter.pk, lesson_group_student_id, chapter)'>Доступты жабу</v-btn>
                                          <v-btn v-else
                                            small
                                            color='success'
                                            @click='enableVideo(lesson_group_student_id, chapter.pk, plans)'
                                            :loading='chapter.loading'>Доступ ашу</v-btn>
                                        </v-col>
                                        <v-col cols='6' md='6' sm='4' xs='4'>
                                          <p v-for="(video, i) in chapter.videos" :key='i' class='mb-0'>
                                            <v-icon small color='lime lighten-1'>mdi-timer</v-icon> <span>{{ convertToTime(video.duration) }}</span>
                                          </p>
                                        </v-col>
                                      </v-row>
                                    </template>
                                    <span v-else class='font-italic font-weight-light orange--text'>Видео енгізілмеген</span>
                                  </v-list-item-content>
                                </v-list-item>
                                <v-divider></v-divider>
                              </v-list>
                            </template>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-container>
                  </template>
                </v-data-iterator>
              </template>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>  
  </v-dialog>
</template>

<script>

import { mapGetters } from "vuex";
import { GET_STUDENT_PLAN_BY_PK, GET_STUDENT_VIDEO_ACTIONS, STUDENT_VIDEO_ACTIONS_ACCESS, STUDENT_VIDEO_ACTIONS_DENY } from "@/store/actions.type.js";

export default {
  data() {
    return {
      dialog: false,
      loading: {
        on_fetch_plans: false,
      },
      group_info: null,
      student_plan_id: null,
      user_info: null,
      plans: null,
      lesson_group_student_id: null,
    }
  },
  methods: {
    openDialog(student_plan_id, subject_info, user_info, lesson_group_student_id) {
      this.student_plan_id = student_plan_id;
      this.subject_info = subject_info;
      this.user_info = user_info;
      this.lesson_group_student_id = lesson_group_student_id;
      this.fetchStudentPlan(this.student_plan_id);
      this.dialog = true;
    },
    closeDialog() {
      this.student_plan_id = null;
      this.subject_info = null;
      this.user_info = null;
      this.loading.on_fetch_plans = false;
      this.dialog = false;
    },
    fetchStudentPlan(student_plan_id) {
      this.loading.on_fetch_plans = true;
      this.$store.dispatch(GET_STUDENT_PLAN_BY_PK, student_plan_id)
        .then(() => {
          this.$store.dispatch(GET_STUDENT_VIDEO_ACTIONS, this.user_info.pk)
            .then(() => {
              this.loading.on_fetch_plans = false;
              this.plans = this.allocateTopicToPlan(this.getCurrentStudentPlan, this.getSubjects);
            })
            .catch(() => { this.closeDialog() });
        })
        .catch(() => { this.closeDialog(); })
    },
    allocateTopicToPlan(student_plan, subjects) {
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
                show: false,
                topics: []
              };
              chapter.topics.forEach(topic => {
                if (topic.is_endpoint && !topic.is_mid_control) {
                  var topic_plan = tmp_student_plan_topics.topics[topic.pk]
                  var has_video = false;
                  if (topic.videos == null) {
                    has_video = false;
                  } else {
                    has_video = topic.videos == 0 ? false : true;
                  }
                  if (topic_plan != undefined) {
                    var tmp_topic = {
                      pk: topic.pk,
                      topic_plan_pk: topic_plan.pk,
                      title: topic.title,
                      has_video: has_video,
                      videos: topic.videos,
                      loading: false
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
                var has_video = false;
                  if (chapter.videos == null) {
                    has_video = false;
                  } else {
                    has_video = chapter.videos == 0 ? false : true;
                  }
                var tmp_topic = {
                  pk: chapter.pk,
                  topic_plan_pk: topic_plan.pk,
                  is_endpoint: true,
                  title: chapter.title,
                  has_video: has_video,
                  videos: chapter.videos,
                  loading: false,
                };
                result.push(tmp_topic);
              }
            }
          });
        }
      });
      return result;
    },
    toggleContent(plans, topic_id) {
      for (let i = 0; i < plans.length; i++) {
        if (plans[i].pk == topic_id) {
          plans[i].show = !plans[i].show;
          break;
        }
      }
    },
    convertToTime(seconds) {
      var hours = Math.floor(seconds / 3600);
      var minutes = Math.floor((seconds - (hours * 3600)) / 60);
      var sec = seconds - (hours * 3600) - (minutes * 60);

      var time = '';
      if (hours != 0) {
        time += hours.toString().padStart(2, '0') + ':' + 
                minutes.toString().padStart(2, '0') + ':' + 
                sec.toString().padStart(2, '0');
      } else if (minutes != 0) {
        time += minutes.toString().padStart(2, '0') + ':' + 
                sec.toString().padStart(2, '0');
      } else {
        time = sec.toString().padStart(2, '0');
      }
      return time;
    },
    enableVideo(lesson_group_student_id, topic_id, topic) {
      topic.loading = true;
      var credentials = {
        lesson_group_student_id: lesson_group_student_id,
        topic_id: topic_id
      };
      this.$store.dispatch(STUDENT_VIDEO_ACTIONS_ACCESS, credentials)
        .then(() => { topic.loading = false; })
        .catch(() => { this.closeDialog(); });
    },
    disableVideo(topic_id, lesson_group_student_id, topic) {
      var lesson_video_action_id = null;
      if (this.getCurrentStudentVideoActions != null) {
        for (let i = 0; i < this.getCurrentStudentVideoActions.length; i++) {
          if (this.getCurrentStudentVideoActions[i].topic == topic_id
            && this.getCurrentStudentVideoActions[i].lesson_group_student == lesson_group_student_id) {
            lesson_video_action_id = this.getCurrentStudentVideoActions[i].pk;
          }
        }
        topic.loading = true;
        this.$store.dispatch(STUDENT_VIDEO_ACTIONS_DENY, lesson_video_action_id)
          .then(() => { topic.loading = false; })
          .catch(() => { this.closeDialog(); })
      }
    },
    accessExist(topic_id, lesson_group_student_id) {
      if (this.getCurrentStudentVideoActions != null) {
        for (let i = 0; i < this.getCurrentStudentVideoActions.length; i++) {
          if (this.getCurrentStudentVideoActions[i].topic == topic_id
            && this.getCurrentStudentVideoActions[i].lesson_group_student == lesson_group_student_id) {
              return true;
            }
        }
        return false;
      }
      return false;
    }
  },
  computed: {
    ...mapGetters(['getCurrentStudentPlan', 'getSubjects', 'getCurrentStudentVideoActions']),
  }
}
</script>

<style>
.cursor-pointer {
  cursor: pointer;
}
</style>
