<template>
  <v-dialog v-model='dialog' persistent scrollable max-width="75%">
    <v-card v-if='form != null'>
      <v-card-title>
        Оқушының сабаққа қатысуы
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" class='headline font-weight-black' text @click="closeDialog()">X</v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container>
          <v-row no-gutters justify="center" class='text-center'>
            <template v-if="is_loading">
              <v-col cols='12'><v-progress-linear indeterminate color="indigo darken-1" ></v-progress-linear></v-col>
            </template>
            <template v-else-if="form != null && form.group_student_visit.abs_date == null && form.student_visit.length == 0">
              Баға қою қажеттілігі жоқ
            </template>
            <template v-else>
              <span class='headline font-weight-black' v-if='form!=null'>{{ form.group_student_visit.day_name + ' ' + formatDate(form.group_student_visit.abs_date) }}</span>
              <v-col cols=12>
                <v-form ref='form' :model='form'>
                  <v-simple-table dense
                                  fixed-header
                                  height="100%"
                                  width="100%"
                                  class='text-left'>
                    <template v-slot:default>
                      <thead>
                        <tr>
                          <th class='numeration'>#</th>
                          <th class='fio'>Аты-жөні</th>
                          <th class='attendance'>Қатысуы</th>
                          <th class='home-work'>Үй жұмысы</th>
                          <th class='no-home-work'>Ұ.ж. берілмеді</th>
                          <th class='student-plan'>Жоспар</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(val, index) in form.student_visit" :key="index">
                          <td class='numeration'>{{ index+1 }}</td>
                          <td class='fio'>{{ val.user_info.last_name + ' ' + val.user_info.first_name }}</td>
                          <template v-if="!val.has_student_freeze">
                            <td class='attendance'>
                              <v-btn v-if="!val.attendance"  block color="red" @click='val.attendance=true'><v-icon color='white'>mdi-minus</v-icon></v-btn>
                              <v-btn v-if="val.attendance"  block color="green" @click='val.attendance=false'><v-icon color='white'>mdi-plus</v-icon></v-btn>
                            </td>
                            <td class='home-work'>
                              <v-text-field v-if='!val.no_home_work' v-model='val.home_work' min='0' max='1' step="0.1" type='number'></v-text-field>
                              <p v-else>Үй жұмысы берілмеді</p>
                            </td>
                            <td class='no-home-work'>
                              <v-switch v-model='val.no_home_work'></v-switch>
                            </td>
                            <td class='student-plan'>
                              <v-btn block 
                                    color="info"
                                    :outlined='is_edit || val.extra_info.selected' 
                                    @click="openStudentPlanForm(val.extra_info.student_plan, val.user_info)">
                                    Жоспар
                              </v-btn>
                            </td>
                          </template>
                          <template v-else>
                            <td colspan="4" class='subtitle-1 grey--text text--darken-1'>Оқушы жеке себептерімен администрациядан сұранды</td>
                          </template>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-form>
              </v-col>
            </template>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click='onSubmit(form)' :loading='loading_submit_button'>Сақтау</v-btn>
        <v-btn color="blue darken-1" text @click="closeDialog()">Отмена</v-btn>
        </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

import { GET_STUDENTS_TO_SET_ABS, SET_GROUP_STUDENT_ABS, UPDATE_GROUP_STUDENT_ABS, GET_EDITABLE_STUDENTS_ABS_LIST } from "@/store/actions.type.js";
import { mapGetters } from "vuex";

export default {
  props: [ "open_student_plan_form" ],
  data() {
    return {
      dialog: false,
      group_id: null,
      is_loading: false,
      form: null,
      loading_submit_button: false,
      is_edit: false,
    }
  },
  methods: {
    openDialog(group_id) {
      this.group_id = group_id;
      this.dialog = true;
      this.getStudentsToSetABS(group_id);
    },
    editStudentsABS(group_student_visit_id, group_id) {
      this.group_id = group_id;
      this.dialog = true;
      this.getEditableStudentsToSetABS(group_student_visit_id);
    },
    closeDialog() {
      this.dialog = false;
      this.is_edit = false;
      this.loading_submit_button = false;
      this.group_id = null;
    },
    getStudentsToSetABS(group_id) {
      this.is_loading = true;
      this.$store.dispatch(GET_STUDENTS_TO_SET_ABS, group_id)
        .then(() => {
          this.setForm();
          this.is_loading = false;
        })
        .catch(() => { this.is_laoding = false; });
    },
    getEditableStudentsToSetABS(group_student_visit_id) {
      this.is_loading = true;
      this.$store.dispatch(GET_EDITABLE_STUDENTS_ABS_LIST, group_student_visit_id)
        .then(() => {
          this.setForm();
          this.is_loading = false;
        })
        .catch(() => { this.is_laoding = false; this.closeDialog(); });
    },
    formatDate (date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`
    },
    setForm() {
      var data = this.getStudentsToABS;
      var result = {
        group_student_visit: {
          pk: null,
          lesson_group: this.group_id,
          abs_date: data.date,
          day_name: data.day_name
        },
        student_visit: []
      };
      if (data.group_student_visit != null) {
        result.group_student_visit.pk = data.group_student_visit
        this.is_edit = true;
      }
      data.students.forEach(item => {
        var tmp = {}
        if (item.student_visit != null) {
          tmp = {
            pk: item.student_visit.pk,
            group_student_visit: item.student_visit.group_student_visit,
            lesson_group_student: item.student_visit.lesson_group_student,
            attendance: item.student_visit.attendance,
            home_work: item.student_visit.home_work,
            no_home_work: item.student_visit.no_home_work,
            user_info: item.user_info,
            has_student_freeze: item.has_student_freeze
          };
        } else {
          tmp = {
            pk: null,
            group_student_visit: null,
            lesson_group_student: item.pk,
            attendance: false,
            home_work: 0,
            no_home_work: false,
            user_info: item.user_info,
            has_student_freeze: item.has_student_freeze
          };
        }
        tmp.extra_info = {
          student_plan: item.student_plan,
          selected: false
        };
        result.student_visit.push(tmp);
      });
      this.form = result;
    },
    onSubmit(form) {
      if (this.checkHomeWorkForZero(form) && (this.is_edit || this.checkAllStudentPlanSelection())) {
        this.loading_submit_button = true;
        if (this.is_edit){
          this.$store.dispatch(UPDATE_GROUP_STUDENT_ABS, form)
            .then(() => {
              this.closeDialog();
              this.$emit('updated');
            })
            .catch(() => {
              this.loading_submit_button = false;
            });
        } else {
          this.$store.dispatch(SET_GROUP_STUDENT_ABS, form)
            .then(() => {
              this.closeDialog();
              this.$emit('updated');
            })
            .catch(() => {
              this.loading_submit_button = false;
            });
        }
      }
    },
    checkHomeWorkForZero(form) {
      var has_home_work_zero = false;
      for (let i = 0; i < form.student_visit.length; i++) {
        if (parseFloat(form.student_visit[i].home_work) == 0
            && !form.student_visit[i].no_home_work
            && form.student_visit[i].attendance
            && !form.student_visit[i].has_student_freeze) {
          has_home_work_zero = true;
          break;
        }
      }
      if (has_home_work_zero) {
        if (confirm('Оқушының үй жұмысына 0 қойылды. Жалғастырасызба?')){
          return true;
        }
        return false;
      }
      return true;
    },
    openStudentPlanForm(student_plan_pk, user_info) {
      var items = {
        student_plan_pk: student_plan_pk,
        user_info: user_info,
      }
      this.open_student_plan_form(items);
    },
    checkAllStudentPlanSelection() {
      var tmp = this.form.student_visit;
      for (let i = 0; i < tmp.length; i++) {
        if (!tmp[i].extra_info.selected && tmp[i].attendance && !tmp[i].has_student_freeze) {
          alert("Жоспарларды белгіле!");
          return false;
        }
      }
      return true;
    },
    setSelectedStudentPlan(student_plan_pk) {
      var tmp = this.form.student_visit;
      for (let i = 0; i < tmp.length; i++) {
        if (tmp[i].extra_info.student_plan == student_plan_pk) {
          tmp[i].extra_info.selected = true;
          break;
        }
      }
    }
  },
  computed: {
    ...mapGetters(["getStudentsToABS"]),
  },
}
</script>

<style scoped>
  .numeration {
    width: 4%;
  }
  .fio {
    width: 30%;
  }
  .attendance {
    width: 20%;
  }
  .home-work {
    width: 20%;
  }
  .no-home-work {
    width: 6%;
  }
  .student-plan {
    width: 20%;
  }
</style>
