<template>
  <v-dialog v-model='dialog' scrollable max-width="60%">
    <v-card v-if='dialog'>
      <v-card-title>
        <span class='headline'>Пробный тест | {{ user_info.last_name }} {{ user_info.first_name }}</span>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" class='headline font-weight-black' text @click="closeDialog()">X</v-btn>
      </v-card-title>
      <v-card-text>
        <v-progress-linear v-if="loading_on_fetch_trial_test_list" indeterminate color="primary" ></v-progress-linear>
        <v-container v-else>
          <v-row>
            <v-col cols='12' md='6' sm='6' xs='12'>
              <template v-for="(val, i) in getTrialTests.trial_test_marks">
                <p :key="i + 'if'" v-if="val.pk !== undefined && !is_edit" class='title'>
                  <span class='title'>{{ formatDate(val.date) }}: {{ val.mark }} балл</span>
                  <v-btn v-if="val.can_edit != undefined && val.can_edit" outlined small color='info' class='ml-2' @click="editTrialTestMark()">Өзгерту</v-btn>
                  <v-btn v-if="val.can_edit != undefined && val.can_edit" fab dark x-small class='mx-1' color="red" :loading="loading_on_delete" @click='remove(val.pk)'>
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon v-on='on'>mdi-archive</v-icon>
                      </template>
                      <span>Удалить</span>
                    </v-tooltip>
                  </v-btn>
                </p>
                <p v-else-if="val.pk !== undefined && is_edit" :key="i+'elseif'">
                  <TrialTestForm
                    :key="componentKey"
                    :form="val"
                    :min_date="getMinDate(getTrialTests.trial_test_marks[i-1])"
                    :re_render="reRender"
                    @close_form='closeForm'/>
                </p>
                <p v-else :key="i + 'else'">
                  <TrialTestForm
                    v-if="show_form"
                    :key="componentKey"
                    :form="setForm(val, getTrialTests.pk)"
                    :min_date="getMinDate(getTrialTests.trial_test_marks[i-1])"
                    :re_render="reRender"
                    @close_form='closeForm'/>
                  <v-btn v-else outlined small color="info" @click='showForm()'>+ Пробный тест енгізу</v-btn>
                </p>
              </template>
            </v-col>
            <v-col cols='12' md='6' sm='6' xs='12'>
              chart or graph
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>

import { mapGetters } from "vuex";
import { GET_STUDENT_TRIAL_TEST, REMOVE_STUDENT_TRIAL_TEST } from '@/store/actions.type.js';
import TrialTestForm from "@/models/trial_test/trial_test_components/trial_test_form.vue";

export default {
  components: { TrialTestForm },
  data() {
    return {
      dialog: false,
      subject_info: null,
      user_info: null,
      // topics: null,
      loading_on_fetch_trial_test_list: false,
      componentKey: 0,
      show_form: false,
      is_edit: false,
      loading_on_delete: false,
    }
  },
  methods: {
    openDialog(items) {
      this.subject_info = items.subject_info;
      this.user_info = items.user_info;
      this.show_form = false;
      this.is_edit = false;
      this.componentKey = 1000;
      this.fetchTrialTests(this.user_info.pk, this.subject_info.pk);
      this.dialog = true;
    },
    closeDialog() {
      this.plan = null;
      this.user_info = null;
      this.loading_on_fetch_trial_test_list = false;
      this.loading_on_delete = false;
      this.dialog = false;
    },
    fetchTrialTests(student_id, subject_id) {
      this.loading_on_fetch_trial_test_list = true;
      var credentials = {
        student_id: student_id,
        subject_id: subject_id,
      }
      this.$store.dispatch(GET_STUDENT_TRIAL_TEST, credentials)
        .then(() => { this.loading_on_fetch_trial_test_list = false; })
        .catch(() => { this.loading_on_fetch_trial_test_list = false; this.closeDialog(); });
    },
    setForm(trial_test_mark, trial_test_id) {
      trial_test_mark.trial_test = trial_test_id;
      return trial_test_mark;
    },
    showForm() {
      this.show_form = true;
    },
    closeForm() {
      this.is_edit = false;
      this.show_form = false;
    },
    editTrialTestMark() {
      this.is_edit = true;
    },
    reRender() {
      this.closeForm();
      this.componentKey++;
    },
    getMinDate(trial_test) {
      if (trial_test === undefined) {
        return '1980-01-01';
      } else {
        return trial_test.date;
      }
    },
    formatDate (date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`
    },
    remove(trial_test_mark_id) {
      if (confirm('Вы точно хотите удалить балл?')) {
        this.loading_on_delete = true;
        this.$store.dispatch(REMOVE_STUDENT_TRIAL_TEST, trial_test_mark_id)
          .then(() => { this.closeDialog(); })
          .catch(() => { this.closeDialog(); })
      }
    }
  },
  computed: {
    ...mapGetters(['getTrialTests'])
  }
}
</script>
