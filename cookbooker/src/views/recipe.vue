<template>
  <div class="recipe">
    <div v-if="recipe">
      <h1>{{ recipe.name }}</h1>
      <p>{{ recipe.preamble }}</p>
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
      recipe: null
    };
  },
  async mounted() {
    const recipe_id = this.$route.params.recipe_id;
    async function fetch_recipe_by_id(recipe_id) {
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

    this.recipe = await fetch_recipe_by_id(recipe_id);
  },
}
</script>
