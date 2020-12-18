<!-- eslint-disable -->
<template>
  <v-app id='quiz'>
    <v-container>
      <v-row>
        <v-col v-if='loading_on_fetch_group_list' cols='12' class='text-center'>
          <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
        </v-col>
        <template v-else>
          <v-col cols='12' md='6' sm='6' xs='12' offset-md='3' offset-sm='3'>
            <SubjectQuizList v-for='(val, i) in getGroupList' :key='i' :group="val" :open_quiz_topic_list="openQuizTopicList"/>
          </v-col>
        </template>
      </v-row>
    </v-container>
    <QuizTopicList ref="quiz_topic_list" :key="componentKey" @updated="update()"/>
  </v-app>
</template>
<!-- eslint-enable -->

<script>

import { mapGetters } from "vuex";
import { GET_GROUP_LIST } from "@/store/actions.type.js";
import SubjectQuizList from "@/models/subject_quiz/subject_quiz_components/subject_quiz_list.vue";
import QuizTopicList from "@/models/subject_quiz/subject_quiz_components/quiz_topic_list.vue";

export default {
  components: { SubjectQuizList, QuizTopicList },
  data() {
    return {
      loading_on_fetch_group_list: false,
      componentKey: 1
    }
  },
  methods: {
    openQuizTopicList(items) {
      this.$refs.quiz_topic_list.openDialog(items);
    },
    update() {
      this.$refs.quiz_topic_list.updateDialog();
      // this.componentKey++;
    }
  },
  computed: {
    ...mapGetters(["getGroupList"]),
  },
  created() {
    if (this.getGroupList == null) {
      this.loading_on_fetch_group_list = true;
      this.$store.dispatch(GET_GROUP_LIST)
        .then(() => { this.loading_on_fetch_group_list = false; })
        .catch(() => { this.loading_on_fetch_group_list = false; });
    }
  }
}
</script>
