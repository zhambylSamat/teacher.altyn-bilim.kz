<template>
  <v-form ref='form' :model='form' @submit.prevent="onSubmit(form)">
    <v-container>
      <v-row>
        <v-col cols='12'>
          <v-divider></v-divider>
        </v-col>
        <v-col cols='12' md='6' sm='6' xs='12'>
          <v-menu
            ref='menu'
            v-model='menu'
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y>
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="computedDateFormatted"
                label='Тест жазған күні'
                :rules="dateRules"
                prepend-icon="mdi-calendar-month-outline"
                hint="ДД.ММ.ГГГГ"
                readonly
                dense
                v-on="on"></v-text-field>
            </template>
            <v-date-picker
              v-model="form.date"
              :max="new Date().toISOString().substr(0,10)"
              :min="min_date"
              :first-day-of-week="1"
              locale="ru"
              @change="save"></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols='12' md='6' sm='6' xs='12'>
          <v-text-field v-model="form.mark" dense label='Бағасы' min='0' max='40' step='1' type='number' :rules="markRules"></v-text-field>
        </v-col>
        <v-col cols='12'>
          <v-btn outlined color='success' small type='submit' :loading='loading_on_save'>Сақтау</v-btn>
          <v-btn text color='info' x-small @click='resetForm()'>Отмена</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>

import { CREATE_STUDENT_TRIAL_TEST, EDIT_STUDENT_TRIAL_TEST } from "@/store/actions.type.js";

export default {
  props: ['form', 're_render', 'min_date'],
  data() {
    return {
      markRules: [ v => /^([0-9]|1[0-9]|2[0-9]|3[0-9]|40)$/.test(v) || "0 мен 40-дің арасында болу керек" ],
      dateRules: [ v => !!v || "" ],
      loading_on_save: false,
      menu: false,
      date: new Date().toISOString().substr(0, 10),
    }
  },
  methods: {
    save (date) {
      this.$refs.menu.save(date);
    },
    formatDate (date) {
      if (!date) return null;
      const [year, month, day] = date.split('-');
      return `${day}.${month}.${year}`
    },
    validate() {
      return this.$refs.form.validate();
    },
    onSubmit(form) {
      if (this.validate()) {
        this.loading_on_save = true;
        if (form.pk === undefined) {
          this.$store.dispatch(CREATE_STUDENT_TRIAL_TEST, form)
            .then(() => { this.re_render(); })
            .catch(() => { this.loading_on_save = false; } )
        } else {
          this.$store.dispatch(EDIT_STUDENT_TRIAL_TEST, form)
            .then(() => { this.re_render(); })
            .catch(() => { this.loading_on_save = false; } )
        }
      }
    },
    resetForm() {
      this.$emit('close_form');
      if (this.form.pk === undefined) {
        this.form.date = null;
        this.form.mark = null;
      }
    },
  },
  computed: {
    computedDateFormatted () {
      if (this.form.date !== undefined) {
        return this.formatDate(this.form.date);
      }
      return null;
    },
  }
}
</script>
