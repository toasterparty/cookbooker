<style>
  .ingredient {
    display: inline;
  }
</style>

<template>
  <div class="recipe">
    <div v-if="recipe">
      <h1>{{ recipe.name }}</h1>
      <br>
      <p>[image]</p>
      <br>
      <p>{{ recipe.preamble }}</p>
      <br>
      <h2>Ingredients</h2>
      <br>
      <li v-for="ingredient in ingredients" :key="ingredient.name">
        <p v-if="ingredient.units" class="ingredient">{{ ingredient.quantity }} {{ ingredient.units }}s {{ ingredient.name }}</p>
        <p v-else class="ingredient">{{ ingredient.quantity }} {{ ingredient.name }}s</p>
      </li>
      <br>
      <h2>Equipment</h2>
      <br>
      <p>stuff like skillet goes here</p>
      <br>
      <h2>Directions</h2>
      <br>
      <ol>
        <li v-for="step in steps" :key="step.step_num">
          <p>
            <span style="font-weight:bold">[{{ step.step_type }}] </span>
            <span v-if="step.duration_m" style="font-weight:bold">[{{ step.duration_m }}min] </span>
            <span>{{ step.description }}</span>
          </p>
          <br>
        </li>
      </ol>
    </div>
    <h1 v-else>⌛</h1>
  </div>
</template>

<script>
import { supabase } from '../lib/supabaseClient'

export default {
  name: 'recipe',
  data() {
    return {
      recipe: null,
      steps: null,
      ingredients: null,
    };
  },
  async mounted() {
    async function get_recipe(recipe_id) {
      try {
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('recipe_id', recipe_id)
          .single();

        if (error) {
          throw error;
        }

        return data;

      } catch (error) {
        console.error('Error fetching recipe:', error.message);
      }
    }
    
    async function get_step(step_id) {
      try {
        const { data, error } = await supabase
          .from('steps')
          .select('*')
          .eq('step_id', step_id)
          .single();

        if (error) {
          throw error;
        }

        return data;

      } catch (error) {
        console.error('Error fetching step:', error.message);
      }
    }

    async function get_step_type(step_type_id) {
      try {
        const { data, error } = await supabase
          .from('step_types')
          .select('*')
          .eq('step_type_id', step_type_id)
          .single();

        if (error) {
          throw error;
        }

        return data;

      } catch (error) {
        console.error('Error fetching step type:', error.message);
      }
    }

    async function get_steps_for_recipe(recipe_id) {
      try {
        const { data, error } = await supabase
          .from('recipe_step')
          .select('*')
          .eq('recipe_id', recipe_id);

        if (error) {
          throw error;
        }

        const steps = [];
        for (var i = 0; i < data.length; i++) {
          const step = await get_step(data[i].step_id);
          const step_type = await get_step_type(step.step_type_id);
          steps.push(
            {
              step_num: data[i].step_num,
              step_type: step_type.name,
              description: step.description,
              duration_m: step.duration_m,
            }
          );
        }

        return steps;

      } catch (error) {
        console.error('Error fetching steps:', error.message);
      }
    }

    async function get_ingredient(ingredient_id) {
      try {
        const { data, error } = await supabase
          .from('ingredients')
          .select('*')
          .eq('ingredient_id', ingredient_id)
          .single();

        if (error) {
          throw error;
        }

        return data;

      } catch (error) {
        console.error('Error fetching ingredient:', error.message);
      }
    }

    async function get_unit(unit_id) {
      try {
        const { data, error } = await supabase
          .from('units')
          .select('*')
          .eq('unit_id', unit_id)
          .single();

        if (error) {
          throw error;
        }

        return data;

      } catch (error) {
        console.error('Error fetching unit:', error.message);
      }
    }

    async function get_ingredients_for_recipe(recipe_id) {
      try {
        const { data, error } = await supabase
          .from('recipe_ingredient')
          .select('*')
          .eq('recipe_id', recipe_id);

        if (error) {
          throw error;
        }

        const ingredients = [];
        for (var i = 0; i < data.length; i++) {
          const ingredient = await get_ingredient(data[i].ingredient_id);
          var units;
          if (data[i].unit_id == null)
          {
            units = null;
          }
          else
          {
            const unit = await get_unit(data[i].unit_id);
            units = unit.name;
          }

          ingredients.push(
            {
              name: ingredient.name,
              quantity: data[i].quantity,
              units: units,
            }
          );
        }

        return ingredients;

      } catch (error) {
        console.error('Error fetching ingredients:', error.message);
      }
    }

    const recipe_id = this.$route.params.recipe_id;
    this.recipe = await get_recipe(recipe_id);
    this.steps = await get_steps_for_recipe(recipe_id);
    this.ingredients = await get_ingredients_for_recipe(recipe_id);
    console.log(this.ingredients);
  },
}
</script>
