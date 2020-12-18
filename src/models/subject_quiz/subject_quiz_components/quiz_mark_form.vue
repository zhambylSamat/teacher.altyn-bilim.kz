<template>
  <v-form ref='form' :model='form' @submit.prevent="">
    <v-container>
      <v-row>
        <v-col cols='12' v-if='config.is_theory' md='4' sm='4' xs=12>
          <v-text-field v-model='form.theory' :disabled="form_disabled" dense type='number' min='0' max='100' step='1' suffix='%' :rules="quizTheoryRules" label="Теория"></v-text-field>
        </v-col>
        <v-col cols='12' v-if='config.is_practice' md='4' sm='4' xs=12>
          <v-text-field v-model='form.practice' :disabled='form_disabled' dense type='number' min='0' max='100' step='1' suffix='%' :rules="quizPracticeRules" label="Есеп"></v-text-field>
        </v-col>
        <v-col cols='12' md='4' sm='4' xs='12'>
          <template v-if='!form_disabled'>
            <v-btn type='submit' color='success' small :loading='loading_on_save' @click='onSubmit(form)'>Сақтау</v-btn>
            <v-btn color="warning" x-small outlined class='ml-3' @click='resetForm()'>Отмена</v-btn>
          </template>
          <v-btn v-else-if="form.pk == undefined" outlined color='info' small @click='allowEdit()'>Енгізу</v-btn>
          <template v-else-if="form.can_edit === undefined || (form.can_edit !== undefined && form.can_edit)">
            <v-btn outlined color="warning" small @click='allowEdit()'>Өзгерту</v-btn>
            <v-btn fab dark x-small class='mx-1' color="red" :loading="loading_on_delete" @click='remove(form.pk)'>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on='on'>mdi-archive</v-icon>
                  </template>
                  <span>Удалить</span>
                </v-tooltip>
              </v-btn>
          </template>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>

import { CREATE_STUDENT_TOPIC_QUIZ_MARK, EDIT_STUDENT_TOPIC_QUIZ_MARK, REMOVE_STUDENT_TOPIC_QUIZ_MARK } from "@/store/actions.type.js";

export default {
  props: ['form', 'config'],
  data() {
    return {
      form_disabled: true,
      quizTheoryRules: [ v => /^([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9]|100)$/.test(v) || "0 мен 100-дің арасында болу керек" ],
      quizPracticeRules: [ v => /^([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9]|100)$/.test(v) || "0 мен 100-дің арасында болу керек" ],
      loading_on_save: false,
      loading_on_delete: false
    }
  },
  methods: {
    validate() {
      if (this.$refs.form.validate()) {
        return true;
      }
      return false;
    },
    onSubmit(form) {
      if (this.validate()) {
        this.loading_on_save = true;
        if (form.pk === undefined) {
          this.$store.dispatch(CREATE_STUDENT_TOPIC_QUIZ_MARK, form)
          .then(() => { this.$emit('updated'); })
          .catch(() => { this.loading_on_save = false; });
        } else {
          this.$store.dispatch(EDIT_STUDENT_TOPIC_QUIZ_MARK, form)
            .then(() => { this.$emit('updated'); })
            .catch(() => { this.loading_on_save = false; });
        }
      }
    },
    remove(topic_quiz_mark_id) {
      if (confirm('Вы точно хотите удалить?')) {
        this.loading_on_delete = true;
        this.$store.dispatch(REMOVE_STUDENT_TOPIC_QUIZ_MARK, topic_quiz_mark_id)
          .then(() => { this.$emit('updated'); })
          .catch(() => { this.loading_on_save = false; });
      }
    },
    allowEdit() {
      this.form_disabled = false;
    },
    resetForm() {
      if (this.form.pk === undefined) {
        this.$refs.form.reset();
      }
      this.form_disabled = true;
    }
  }
}
</script>
