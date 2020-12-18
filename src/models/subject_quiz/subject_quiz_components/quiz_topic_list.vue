<template>
  <v-dialog v-model='dialog' scrollable max-width="60%">
    <v-card v-if='dialog'>
      <v-card-title>
        <span class='headline'>Аралық бақылау | {{ user_info.last_name }} {{ user_info.first_name }}</span>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" class='headline font-weight-black' text @click="closeDialog()">X</v-btn>
      </v-card-title>
      <v-card-text>
        <v-progress-linear v-if="loading_on_fetch_topic_plans" indeterminate color="primary" ></v-progress-linear>
        <v-simple-table v-else>
          <template v-slot:default>
            <tbody>
              <tr v-for="(quiz, i) in getTopicQuizMarks.quiz" :key="i">
                <td style='width: 2%;'>{{ i + 1 }}</td>
                <td style='width: 40%;'>{{ quiz.topic_info.title }}</td>
                <td style='width: 58%;'>
                  <template v-for="(topic_quiz, j) in quiz.topic_quiz">
                    <QuizMarkForm :key='j' :form="setForm(topic_quiz, quiz.pk)" :config="getTopicQuizMarks.config" @updated="update()"/> <!-- :key='j+componentKey' -->
                  </template>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

import { mapGetters } from "vuex";
import { GET_STUDENT_TOPIC_QUIZ_MARK_LIST } from '@/store/actions.type.js';
import QuizMarkForm from "@/models/subject_quiz/subject_quiz_components/quiz_mark_form.vue";

export default {
  components: { QuizMarkForm },
  data() {
    return {
      dialog: false,
      plan_info: null,
      user_info: null,
      topics: null,
      loading_on_fetch_topic_plans: false,
      // componentKey: 1000
    }
  },
  methods: {
    openDialog(items) {
      this.plan_info = items.plan;
      this.user_info = items.user_info;
      this.fetchTopicPlansWithMarks(this.plan_info.subject_plan);
      this.dialog = true;
    },
    updateDialog() {
      if (this.plan_info == null || this.user_info == null) {
        this.closeDialog();
      } else {
        this.fetchTopicPlansWithMarks(this.plan_info.subject_plan);
        this.dialog = true;
      }
    },
    closeDialog() {
      this.plan = null;
      this.user_info = null;
      this.loading_on_fetch_topic_plans = false;
      this.dialog = false;
    },
    fetchTopicPlansWithMarks(student_subject_plan_pk) {
      this.loading_on_fetch_topic_plans = true;
      this.$store.dispatch(GET_STUDENT_TOPIC_QUIZ_MARK_LIST, student_subject_plan_pk)
        .then(() => { this.loading_on_fetch_topic_plans = false; })
        .catch(() => { this.loading_on_fetch_topic_plans = false; this.closeDialog(); });
    },
    setForm(quiz_form, topic_plan_pk) {
      quiz_form.topic_plan = topic_plan_pk;
      return quiz_form;
    },
    update() {
      this.$emit('updated');
    },
  },
  computed: {
    ...mapGetters(['getTopicQuizMarks'])
  }
}
</script>
