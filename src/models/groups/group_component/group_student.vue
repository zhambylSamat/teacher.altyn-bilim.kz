<template>
  <div>
    <v-simple-table dense>
      <template v-slot:default>
        <tbody>
          <tr v-if="student_plans.length == 0">
            <td>There is no student plans</td>
          </tr>
          <tr v-else v-for="(val, index) in student_plans" :key="index">
            <td>{{ val.user_info.last_name + ' ' + val.user_info.first_name }}</td>
            <td><v-btn x-small
                  outlined
                  color='green'
                  @click='videoAccess(val.student_plan, val.subject_info, val.user_info, val.pk)'
                  :disabled="is_disabled"
                  :loading="loading.on_fetch_subjects">Видео</v-btn></td>
            <td>notifications</td>
            <td>{{ val.subject_info.title }}</td>
            <!-- <td>{{ val.progress }}%</td> -->
            <td>{{ val.user_info.username }}</td>
            <td>
              <span v-if="val.is_password_reset">Пароль: <span class='font-italic font-weight-bold'>1234567</span></span>
              <span v-else>Сбросить пароль (скоро)</span>
              <!-- <v-btn v-else x-small outlined color='indigo' @click="resetPassword(val.user_info.pk)">Сбросить пароль</v-btn> -->
            </td>
            <!-- <td>{{ formatDate(val.started_date) }}</td> -->
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <VideoAccess ref='video_access' />
  </div>
</template>

<script>

import { mapGetters } from "vuex";
import { GET_FULL_SUBJECT_LIST } from "@/store/actions.type.js";
import VideoAccess from "@/models/groups/group_component/video_access.vue";

export default {
  props: ['student_plans', 'schedules'],
  components: { VideoAccess },
  data() {
    return {
      loading: {
        on_fetch_subjects: false,
      },
      is_disabled: false,
    }
  },
  methods: {
    resetPassword(student_user_pk) {
      console.log(student_user_pk);
    },
    formatDate (date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`
    },
    videoAccess(student_plan_id, subject_info, user_info, lesson_group_student_id) {
      this.$refs.video_access.openDialog(student_plan_id, subject_info, user_info, lesson_group_student_id);
    },
    fetchSubjects() {
      this.loading.on_fetch_subjects = true;
      this.$store.dispatch(GET_FULL_SUBJECT_LIST)
        .then(() => { this.loading.on_fetch_subjects = false })
        .catch(() => { this.loading.on_fetch_subjects = false });
    },
    enableToAccessVideo() {
      // this.is_disabled = false;
      var today = new Date();
      for (let i = 0; i < this.schedules.length; i++) {
        if (this.schedules[i].week_num == today.getDay()) {
          var schedule = this.schedules[i];
          var start_hours = schedule.start_time.split(':')[0];
          var start_minutes = schedule.start_time.split(':')[1];
          var start_seconds = schedule.start_time.split(':')[2];
          var finish_hours = schedule.finish_time.split(':')[0];
          var finish_minutes = schedule.finish_time.split(':')[1];
          var finish_seconds = schedule.finish_time.split(':')[2];
          var start_time = new Date();
          start_time.setHours(start_hours);
          start_time.setMinutes(parseInt(start_minutes) - 30);
          start_time.setSeconds(start_seconds);
          var finish_time = new Date();
          finish_time.setHours(finish_hours);
          finish_time.setMinutes(parseInt(finish_minutes) + 30);
          finish_time.setSeconds(finish_seconds);
          if (today.getTime() >= start_time.getTime() && today.getTime() <= finish_time.getTime()) {
            this.is_disabled = false;
          } else {
            this.is_disabled = true;
          }
          this.is_disabled = false;
          break;
        } else {
          this.is_disabled = true;
        }
      }
    }
  },
  computed: {
    ...mapGetters(['getSubjects'])
  },
  created() {
    this.enableToAccessVideo();
    if (this.getSubjects == null) {
      this.fetchSubjects();
    }
  }
}
</script>
