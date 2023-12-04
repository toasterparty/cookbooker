<style>
label {
  margin-right: 50px;
}

input[type="radio"] {
  margin-top: 20px;
  margin-right: 5px;
  margin-bottom: 50px;
}

.textbox {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  width: 300px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.modal-label {
  font-size: 24px;
}

.edit-button {
  color: #ffffff;
  background-color: #cacaca;
  border: none;
  border-radius: 4px;
  width: 28px;
  font-size: 11px;
}

.edit-button:hover {
  background-color: #d4d4d4;
}

</style>

<template>
  <div id="app">
    
    <h1>Data Editor</h1>

    <label v-for="(tab, index) in tabs" :key="index">
      <input type="radio" :value="tab" v-model="selected_tab" @change="tab_changed"> {{ tab }}
    </label>

    <h1 v-if="loading===true">⌛</h1>
    <div v-else-if="selected_tab">
      <h2>{{ selected_tab }}</h2>
      <div v-if="selected_tab == 'Categories'">
        <p
          v-for="(category, index) in categories"
          :key="category"
        >
          <button class="remove-button" @click="remove_category(index)">x</button>
          <button class="edit-button" @click="edit_category(index)">✏️</button>
          {{ category.name }}
        </p>
      </div>
      <div v-else-if="selected_tab == 'Units'">
        <p
          v-for="(unit, index) in units"
          :key="unit"
        >
          <button class="remove-button" @click="remove_unit(index)">x</button>
          <button class="edit-button" @click="edit_unit(index)">✏️</button>
          {{ unit.name }}
        </p>
      </div>
      <div v-else-if="selected_tab == 'Step Types'">
        <p
          v-for="(step_type, index) in step_types"
          :key="step_type"
        >
          <button class="remove-button" @click="remove_step_type(index)">x</button>
          <button class="edit-button" @click="edit_step_type(index)">✏️</button>
          {{ step_type.name }}
        </p>
      </div>

      <button class="add-button" @click="show_add_new_modal">
        +
      </button>

      <div class="button-container">
          <button class="save-button" @click="save_tab">Save</button>
      </div>
    </div>

    <div v-if="is_modal_shown">
      <div class="modal-overlay" @click="close_modal"></div>
      <div class="modal">
        <label v-if="is_edit_mode" class="modal-label">Edit {{ selected_tab_singular }}</label>
        <label v-else class="modal-label">New {{ selected_tab_singular }}</label>
        <div>
          <input type="text" class="textbox" v-model="new_name" />
        </div>
        <button @click="save_modal">Save</button>
        <button @click="close_modal">Cancel</button>
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
      tabs: ['Categories', 'Units', 'Step Types', 'Ingredients'],
      selected_tab: '',
      selected_tab_singular: '',

      loading: false,

      is_modal_shown: false,
      is_edit_mode: false,
      edit_obj: null,
      new_name: null,

      categories: null,
      remove_categories: null,

      units: null,
      remove_units: null,

      step_types: null,
      remove_step_types: null,

      tags: null
    }
  },
  async created() {
    await this.tab_changed()
  },
  methods: {
    list_for_tab() {
      switch (this.selected_tab) {
        case 'Categories': {
          return this.categories
        }
        case 'Units': {
          return this.units
        }
        case 'Step Types': {
          return this.step_types
        }
        case 'Ingredients': {
          return this.ingredients
        }
        default: {
          console.error('Unexpected selected_tab')
          return null
        }
      }
    },
    async tab_changed() {
      this.selected_tab_singular = ''

      this.loading = true

      this.is_modal_shown = false
      this.is_edit_mode = false
      this.edit_obj = null
      this.new_name = null

      this.categories = null
      this.remove_categories = null

      this.units = null
      this.remove_units = null

      this.step_types = null
      this.remove_step_types = null

      this.tags = null

      switch (this.selected_tab) {
        case 'Categories': {
          this.selected_tab_singular = "Category"
          this.remove_categories = []
          this.categories = await api.get_categories()
          break
        }
        case 'Units': {
          this.selected_tab_singular = "Unit"
          this.remove_units = []
          this.units = await api.get_units()
          break
        }
        case 'Step Types': {
          this.selected_tab_singular = "Step Type"
          this.remove_step_types = []
          this.step_types = await api.get_step_types()
          break
        }
        case 'Ingredients': {
          this.selected_tab_singular = "Ingredient"
          break
        }
        case '': {
          break
        }
        default: {
          console.error('Unexpected selected_tab')
        }
      }
      
      this.loading = false
    },
    show_add_new_modal() {
      this.is_edit_mode = false
      this.edit_obj = {}
      this.new_name = null
      this.is_modal_shown = true
    },
    close_modal() {
      this.is_modal_shown = false
    },
    save_modal() {
      var obj = this.edit_obj
      switch (this.selected_tab) {
        case 'Categories': {
          obj.name = this.new_name
          break;
        }
        case 'Units': {
          obj.name = this.new_name
          break;
        }
        case 'Step Types': {
          obj.name = this.new_name
          break;
        }
        case 'Ingredients': {
          break;
        }
        default: {
          console.error('Unexpected selected_tab')
        }
      }

      if (this.is_edit_mode === false) {
        this.list_for_tab().push(obj) 
      }

      this.close_modal()
    },
    async save_tab() {
      switch (this.selected_tab) {
        case 'Categories': {
          await api.update_categories(this.categories, this.remove_categories)
          break;
        }
        case 'Units': {
          await api.update_units(this.units, this.remove_units)
          break;
        }
        case 'Step Types': {
          await api.update_step_types(this.step_types, this.remove_step_types)
          break;
        }
        case 'Ingredients': {
          break;
        }
        default: {
          console.error('Unexpected selected_tab')
        }
      }

      this.selected_tab = ''
      this.tab_changed()
    },
    remove_category(index) {
      const category = this.categories[index]
      this.remove_categories.push(category)
      this.categories.splice(index, 1)
    },
    edit_category(index) {
      this.is_edit_mode = true
      this.edit_obj = this.categories[index]
      this.new_name = this.edit_obj.name
      this.is_modal_shown = true
    },
    remove_unit(index) {
      const unit = this.units[index]
      this.remove_units.push(unit)
      this.units.splice(index, 1)
    },
    edit_unit(index) {
      this.is_edit_mode = true
      this.edit_obj = this.units[index]
      this.new_name = this.edit_obj.name
      this.is_modal_shown = true
    },
    remove_step_type(index) {
      const step_type = this.step_types[index]
      this.remove_step_types.push(step_type)
      this.step_types.splice(index, 1)
    },
    edit_step_type(index) {
      this.is_edit_mode = true
      this.edit_obj = this.step_types[index]
      this.new_name = this.edit_obj.name
      this.is_modal_shown = true
    },
  }
}
</script>
