<style>
.ingredient {
  display: inline;
}

header > h1 {
  display: inline-block;
}
header span {
  margin-left: 3px;
  vertical-align: super;
  font-size: smaller;
}
</style>

<!-- TODO: CSS instead of br -->
<template>
  <div class="recipe">
    <div v-if="recipe">
      <header>
        <h1>{{ recipe.name }}</h1>
        <span>
          <a :href="'/edit/' + this.$route.params.recipe_id">edit</a>
        </span>
      </header>
      <img
        :src="
          'https://kong.toasterparty.net/storage/v1/object/public/recipe-images/' +
          this.recipe.image
        "
        style="object-fit: contain; height: 400px; width: 400px"
      />
      <p>{{ recipe.preamble }}</p>
      <br />
      <h2>Ingredients</h2>
      <br />
      <li v-for="ingredient in ingredients" :key="ingredient.name">
        <p v-if="use_unit(ingredient.units)" class="ingredient">
          {{ ingredient.quantity }} {{ ingredient.units.name }}s {{ ingredient.name }}
        </p>
        <p v-else class="ingredient">{{ ingredient.quantity }} {{ ingredient.name }}s</p>
      </li>
      <br />
      <h2>Directions</h2>
      <br />
      <ol>
        <li v-for="step in steps" :key="step.step_num">
          <p>
            <span style="font-weight: bold">[{{ step.step_type }}] </span>
            <span v-if="step.duration_m !== null && step.duration_m !== 0" style="font-weight: bold"
              >[{{ step.duration_m }}min]
            </span>
            <span>{{ step.description }}</span>
          </p>
          <br />
        </li>
      </ol>
    </div>
    <h1 v-else>⌛</h1>
  </div>
</template>

<script>
import * as api from '../lib/supabase_api'

export default {
  name: 'recipe',
  data() {
    return {
      recipe: null,
      steps: null,
      ingredients: null
    }
  },
  async created() {
    const recipe_id = this.$route.params.recipe_id
    this.recipe = await api.get_recipe(recipe_id)
    this.steps = await api.get_steps_for_recipe(recipe_id)
    this.ingredients = await api.get_ingredients_for_recipe(recipe_id)
  },
  methods: {
    use_unit(unit) {
      // don't use if it's not specified, or if it's the "Count" unit
      return !(unit === null || unit.unit_id === 0)
    }
  }
}
</script>
