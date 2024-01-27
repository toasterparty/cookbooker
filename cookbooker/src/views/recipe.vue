<style>
header > h1 {
  display: inline-block;
}

header span {
  margin-left: 3px;
  vertical-align: super;
  font-size: smaller;
}

.fraction {
  display: inline-block;
  text-align: center;
  vertical-align: middle;
}

.fraction .numerator {
  border-bottom: 1px solid #000;
  padding: 0.5px 1px;
  display: block;
}

.units {
  display: inline-flex;
  align-items: center;
}

.whole-number {
  font-size: 1.5em;
  margin-right: 5px;
  vertical-align: middle;
}

.header-label {
  margin-bottom: 10px;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
}
</style>

<!-- TODO: CSS instead of br -->
<template>
  <div class="recipe">
    <div v-if="recipe">
      <header>
        <h1 v-if="recipe.name" class="header-label">{{ recipe.name }}</h1>
        <h1 v-else>[NEW RECIPE]</h1>
        <span>
          <a :href="'/edit/' + this.$route.params.recipe_id">edit</a>
        </span>
      </header>

      <div class="tags-container">
        <div
          v-for="(tag, index) in tags"
          :key="index"
          class="tag"
          :style="{ backgroundColor: tag.color }"
        >
          {{ tag.name }}
        </div>
      </div>

      <img
        v-if="this.recipe.image"
        :src="
          'https://kong.toasterparty.net/storage/v1/object/public/recipe-images/' +
          this.recipe.image
        "
        style="object-fit: contain; height: 500px; width: 500px"
      />
      <p>{{ recipe.preamble }}</p>
      <br />
      <h2 v-if="ingredients && ingredients.length > 0" class="header-label">Ingredients</h2>
      <div v-for="(ingredient, index) in ingredients" :key="index">
        <p
          v-if="ingredient.numerator && ingredient.denominator"
          style="display: inline"
          class="units"
        >
          <span v-if="ingredient.quantity" class="whole-number">{{ ingredient.quantity }}</span>
          <span class="fraction">
            <span class="numerator">{{ ingredient.numerator }}</span>
            <span class="denominator">{{ ingredient.denominator }}</span>
          </span>
          {{ ingredient_string(ingredient) }}
        </p>
        <p v-else style="display: inline">
          <span class="whole-number">{{ ingredient.quantity }}</span>
          {{ ingredient_string(ingredient) }}
        </p>
      </div>
      <br />
      <h2 v-if="steps && steps.length > 0" class="header-label">Directions</h2>
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
      ingredients: null,
      tags: null
    }
  },
  async created() {
    const recipe_id = this.$route.params.recipe_id
    this.recipe = await api.get_recipe(recipe_id)
    this.steps = await api.get_steps_for_recipe(recipe_id)
    this.ingredients = await api.get_ingredients_for_recipe(recipe_id)
    this.tags = await api.get_tags_for_recipe(recipe_id)
  },
  methods: {
    ingredient_string(ingredient) {
      if (ingredient.quantity === null || ingredient.quantity === undefined) {
        console.error('No quantity for ingredient: ', ingredient)
        return
      }

      const units = ingredient.units
      const use_unit = !(units === null || units.unit_id === 0)

      var output = ''

      if (use_unit) {
        output += ingredient.units.name + 's '
      }

      if (ingredient.alias) {
        output += ingredient.alias
      } else {
        output += ingredient.name

        if (!use_unit) {
          output += 's'
        }
      }

      return output
    }
  }
}
</script>
