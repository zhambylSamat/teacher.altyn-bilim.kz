<!-- eslint-disable -->
<template> 
  <v-container>
    <v-row no-gutters justify='center'>
      <v-col cols='12' xs='12' sm='12' md='12' class='mb-4'>
        <v-data-table
          ref="dt_group_list"
          :headers="headers"
          :items="filteredItems"
          sort-by="title"
          :sort-desc="false"
          class='elevation-1'
          :items-per-page="-1"
          hide-default-footer
          show-expand
          :custom-sort="customSort"
          :loading="loading_on_fetch_groups"
          item-key="pk">
          <template v-slot:item="{item, index, headers, expand, isExpanded}">
            <tr>
              <td v-for="n in headers" :key="n.value">
                <template v-if="n.value === 'group_numeration'">
                  {{ index + 1 }}
                </template>
                <template v-else-if="n.value === 'title'">
                  {{ item[n.value] }}
                </template>
                <template v-else-if="n.value === 'notification'">

                  <v-tooltip top v-if='false'>
                    <template v-slot:activator="{ on }">
                      <v-avatar v-on='on' size="25" color='orange lighten-1' class='mx-1'>
                        <v-icon small color="white">mdi-format-list-numbered</v-icon>
                      </v-avatar>
                    </template>
                    <span>Коммент енгізбеген</span>
                  </v-tooltip>

                  <v-tooltip top v-if='false'>
                    <template v-slot:activator="{ on }">
                      <v-avatar v-on='on' size='25' color='orange lighten-1' class='mx-1'>
                        <v-icon small color='white'>mdi-align-horizontal-left</v-icon>
                      </v-avatar>
                    </template>
                    <span>Опрос толтырмаған</span>
                  </v-tooltip>

                  <v-tooltip top v-if='false'>
                    <template v-slot:activator="{ on }">
                      <v-avatar v-on='on' size='25' color='red lighten-1' class='mx-1'>
                        <v-icon small color='white'>mdi-currency-kzt</v-icon>
                      </v-avatar>
                    </template>
                    <span>Оплатасы жоқ</span>
                  </v-tooltip>

                  <v-tooltip top v-if='false'>
                    <template v-slot:activator="{ on }">
                      <v-avatar v-on='on' size='25' color='red lighten-1' class='mx-1'>
                        <v-icon small color='white'>mdi-file-document</v-icon>
                      </v-avatar>
                    </template>
                    <span>Договор өткізбеген</span>
                  </v-tooltip>

                </template>
                <template v-else-if="n.value === 'schedule'">
                  <template v-for="(val, i) in item[n.value]">
                    <span :key="i">{{ val }}</span>
                    <br :key="i+'br'">
                  </template>
                </template>
                <template v-else-if="n.value === 'student_count'">
                  {{ item[n.value] }}
                </template>
                <template v-else-if="n.value === 'diary'">
                  <v-btn small color='indigo--text' @click.native="openVisitLog(item.pk, item.title)">Күнделік</v-btn>
                </template>
                <template v-else-if="n.value === 'student_list'">
                  <v-btn small color='indigo--text' @click="expand(!isExpanded)">
                    <v-icon>mdi-format-list-bulleted</v-icon>
                  </v-btn>
                </template>
              </td>
            </tr>
          </template>

          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              <GroupStudent :student_plans="item.student_plans" :schedules="item.schedule_obj"/>
            </td>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<!-- eslint-enable -->

<script>

import { mapGetters } from "vuex";
import {
  GET_GROUP_LIST,
  // GET_STUDENT_PLAN,
  // RESET_STUDENT_PASSWORD
} from "@/store/actions.type.js";
import GroupStudent from "@/models/groups/group_component/group_student.vue";

export default {
  components: {
    GroupStudent
  },
  props: ['open_visit_log'],
  data() {
    return {
      loading_on_fetch_groups: false,
      isMobile: false,
      search: "",
      headers: [
        {
          text: '#',
          value: 'group_numeration'
        },
        {
          text: 'Группа',
          sortable: true,
          value: "title"
        },
        {
          text: 'Ескертулер',
          sortable: false,
          value: 'notification'
        },
        {
          text: 'Сабақ кесетсі',
          sortable: false,
          value: 'schedule'
        },
        {
          text: 'Оқушылар',
          sortable: false,
          value: 'student_count'
        },
        {
          text: 'Күнделік',
          sortable: false,
          value: 'diary'
        },
        {
          text: 'Оқушылар тізімі',
          sortable: false,
          value: 'student_list',
        }
      ]
    }
  },
  methods: {
    onResize () {
      this.isMobile = window.innerWidth < 600
    },
    customSort(items, index, isDesc) {
      items.sort((a,b) => {
        if (index[0] === 'group_name') {
          if (!isDesc[0]) {
            return a.title.localeCompare(b.title);
          } else {
            return b.title.localeCompare(a.title);
          }
        }
      });
      return items;
    },
    removeSeconds(time) {
      var result = time.split(':');
      return result[0] + ':' + result[1];
    },
    openVisitLog(group_id, group_title) {
      this.open_visit_log(group_id, group_title);
    }
  },
  computed: {
    ...mapGetters(["getGroupList"]),
    filteredItems() {
      if (this.getGroupList != null) {
        var result = [];
        this.getGroupList.forEach(elem => {
          var tmp = {
            pk: elem.pk,
            title: elem.title,
            schedule: [],
            schedule_obj: elem.schedules,
            student_count: 0 + '/' + elem.student_limit,
            students: [],
            student_plans: elem.student_plans
          }
          elem.schedules.forEach(schedule => {
            var tmp_schedule = schedule.office_info.title + ' -> '
                                + schedule.week_day_info.short_title + ' '
                                + this.removeSeconds(schedule.start_time) + ' - '
                                + this.removeSeconds(schedule.finish_time);
            tmp.schedule.push(tmp_schedule);
          });
          result.push(tmp);
        });
        return result.filter((i) => {
          var search = this.search.toString().toLowerCase();
          if (i.title.toString().toLowerCase().indexOf(search) >= 0) {
            return true;
          }
        });
      }
      return [];
    }
  },
  created: function() {
    this.loading_on_fetch_students = true;
    this.$store.dispatch(GET_GROUP_LIST)
      .then(() => {
        this.loading_on_fetch_groups = false;
      })
      .catch(() => {
        this.loading_on_fetch_groups = false;
      });
  },
  beforeDestroy () {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true })
    }
  },

  mounted () {
    this.onResize();
    window.addEventListener('resize', this.onResize, { passive: true });
  }
}
</script>