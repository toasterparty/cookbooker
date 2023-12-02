<style>
label {
  margin-right: 50px;
}

input[type="radio"] {
  margin-top: 20px;
  margin-right: 5px;
  margin-bottom: 50px;
}
</style>

<template>
  <div id="app">
    
    <h1>Data Editor</h1>

    <label v-for="(tab, index) in tabs" :key="index">
      <input type="radio" :value="tab" v-model="selected_tab"> {{ tab }}
    </label>

    <div v-if="selected_tab">
      <h2>{{ selected_tab }}</h2>

      <div v-if="selected_tab == 'Categories'">
        <p
          v-for="(category, index) in categories"
          :key="category"
        >
          <button class="remove-button" @click="remove_category(index)">
            x
          </button>
          {{ category.name }}
        </p>
        <button class="add-button" @click="add_category(index)">
          +
        </button>
      </div>
      <div v-else-if="selected_tab == 'Units'">
        Units
      </div>
      <div v-else-if="selected_tab == 'Step Types'">
        Step Types
      </div>

      <div class="button-container">
          <button class="save-button" @click="save_data">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from '../lib/supabase_api'

export default {
  name: 'data_editor',
  data() {
    return {
      categories: [],
      step_types: [],
      tags: [],
      units: [],
      tabs: ['Categories', 'Units', 'Step Types'],
      selected_tab: ''
    }
  },
  async created() {
    this.categories = await api.get_categories()
    this.step_types = await api.get_step_types()
    this.tags = []
    this.units = await api.get_units()
  },
  methods: {
    async save_data() {
      
    }
  }
}
</script>
