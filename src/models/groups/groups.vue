<!-- eslint-disable -->
<template>
  <v-app id='student'>

    <GroupList :open_visit_log="openVisitLog" />
    <!-- <StudentList :edit_student="editStudentFormDialog" :newPlanAction="openStudentPlanFormDialog" :editPlanAction="editStudentPlanAction" /> -->


    <!-- <StudentForm ref='studentFormDialog'/> -->
    <!-- <StudentPlanForm ref='studentPlanFormDialog'/> -->
    <VisitLog ref='visit_log'
              :open_visit_log_form="openVisitLogForm"
              :open_visit_log_form_edit="openVisitLogFormEdit" />
    <VisitLogForm ref='visit_log_form'
                  :open_student_plan_form="openStudentSetPlanForm"
                  @updated="visit_log_updated" />
    <StudentSetPlanForm ref='student_set_plan_form' @clicked="onSelectStudentPlan"/>
  </v-app>
</template>
<!-- eslint-enable -->

<script>
import GroupList from "@/models/groups/group_component/group_list.vue";
import VisitLog from "@/models/groups/group_component/visit_log.vue";
import VisitLogForm from "@/models/groups/group_component/visit_log_form.vue";
import StudentSetPlanForm from "@/models/groups/group_component/student_set_plan_form.vue";

export default {
  components: {
    GroupList,
    VisitLog,
    VisitLogForm,
    StudentSetPlanForm,
  },
  methods: {
    openVisitLog(group_id, group_title) {
      this.visit_log = {
        group_id: group_id,
        group_title: group_title
      };
      this.$refs.visit_log.openDialog(group_id, group_title);
    },
    openVisitLogForm(item) {
      this.$refs.visit_log_form.openDialog(item);
    },
    openVisitLogFormEdit(group_student_visit_id, group_id) {
      this.$refs.visit_log_form.editStudentsABS(group_student_visit_id, group_id);
    },
    openStudentSetPlanForm(items) {
      this.$refs.student_set_plan_form.openDialog(items);
    },
    onSelectStudentPlan(student_plan_pk) {
      this.$refs.visit_log_form.setSelectedStudentPlan(student_plan_pk);
    },
    visit_log_updated() {
      if (this.visit_log != null) {
        this.$refs.visit_log.updateDialog();
      }
    }
  },
}
</script>
