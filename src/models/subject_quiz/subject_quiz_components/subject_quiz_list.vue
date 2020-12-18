<template>
  <v-card class='my-3'>
    <v-card-title class='title'>{{ group.title }}</v-card-title>
    <v-divider></v-divider>
    <v-list dense>
      <v-list-item v-for='(student, i) in group.student_plans' :key='i' style='border-bottom: 1px solid lightgray;'>
        <v-list-item-content>
          {{ student.user_info.last_name }} {{ student.user_info.first_name }}
        </v-list-item-content>
        <v-list-item-content>
          <v-list dense>
            <v-list-item v-for="(plan, j) in student.plan_subjects" :key='j'>
              <v-list-item-content>
                <v-btn color='info' small @click='setQuizTopicMark(plan, student.user_info)'>{{ plan.subject_info.title }}</v-btn>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>

export default {
  props: ['group', 'open_quiz_topic_list'],
  data() {
    return {

    }
  },
  methods: {
    setQuizTopicMark(plan, user_info) {
      var items = {
        plan: plan,
        user_info: user_info
      };
      this.open_quiz_topic_list(items);
    }
  }
}
</script>
