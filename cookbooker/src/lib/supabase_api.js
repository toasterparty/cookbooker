import { supabase } from './supabase_client'

/* General */

export async function upload_file(file, filename) {
  try {
    const { data, error } = await supabase.storage.from('recipe-images').upload(filename, file, {
      cacheControl: '3600',
      upsert: false
    })

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error uploading file:', error.message)
  }
}

export async function delete_file(filename) {
  try {
    const { data, error } = await supabase.storage.from('recipe-images').remove([filename])

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error deleting file:', error.message)
  }
}

/* Recipe Lookup */

export async function get_all_recipes() {
  const { data } = await supabase.from('recipes').select()
  return data
}

export async function get_recipe(recipe_id) {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('recipe_id', recipe_id)
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching recipe:', error.message)
  }
}

export async function get_step(step_id) {
  try {
    const { data, error } = await supabase.from('steps').select('*').eq('step_id', step_id).single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching step:', error.message)
  }
}

export async function get_step_type(step_type_id) {
  try {
    const { data, error } = await supabase
      .from('step_types')
      .select('*')
      .eq('step_type_id', step_type_id)
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching step type:', error.message)
  }
}

export async function get_steps_for_recipe(recipe_id) {
  try {
    const { data, error } = await supabase
      .from('recipe_step')
      .select('*')
      .eq('recipe_id', recipe_id)

    if (error) {
      throw error
    }

    const steps = []
    for (var i = 0; i < data.length; i++) {
      const step = await get_step(data[i].step_id)
      const step_type = await get_step_type(step.step_type_id)
      steps.push({
        step_num: data[i].step_num,
        step_type: step_type.name,
        description: step.description,
        duration_m: step.duration_m
      })
    }

    return steps
  } catch (error) {
    console.error('Error fetching steps:', error.message)
  }
}

export async function get_ingredient(ingredient_id) {
  try {
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .eq('ingredient_id', ingredient_id)
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching ingredient:', error.message)
  }
}

export async function get_unit(unit_id) {
  try {
    const { data, error } = await supabase.from('units').select('*').eq('unit_id', unit_id).single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching unit:', error.message)
  }
}

export async function get_units() {
  try {
    const { data, error } = await supabase.from('units').select('*')

    if (error) {
      throw error
    }

    data.sort((a, b) => a.unit_id - b.unit_id)

    return data
  } catch (error) {
    console.error('Error fetching units:', error.message)
  }
}

async function get_recipe_ingredients(recipe_id) {
  try {
    const { data, error } = await supabase
      .from('recipe_ingredient')
      .select('*')
      .eq('recipe_id', recipe_id)

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching ingredient_ids for recipe:', error.message)
  }
}

export async function get_ingredients() {
  try {
    const { data, error } = await supabase.from('ingredients').select('*')

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching ingredients:', error.message)
  }
}

export async function get_ingredients_for_recipe(recipe_id) {
  try {
    const recipe_ingredients = await get_recipe_ingredients(recipe_id)

    const ingredients = []
    for (var i = 0; i < recipe_ingredients.length; i++) {
      const ingredient = await get_ingredient(recipe_ingredients[i].ingredient_id)

      var units
      if (recipe_ingredients[i].unit_id === null) {
        units = null
      } else {
        units = await get_unit(recipe_ingredients[i].unit_id)
      }

      ingredients.push({
        name: ingredient.name,
        ingredient_id: recipe_ingredients[i].ingredient_id,
        quantity: recipe_ingredients[i].quantity,
        units: units
      })
    }

    return ingredients
  } catch (error) {
    console.error('Error fetching ingredients for recipe:', error.message)
  }
}

export async function get_categories() {
  try {
    const { data, error } = await supabase.from('categories').select('*')

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching categories:', error.message)
  }
}

/* Ingredient Modification */

export async function add_ingredient(ingredient) {
  try {
    const { data, error } = await supabase.from('ingredients').insert([ingredient])

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error adding new ingredient:', error.message)
  }
}

/* Recipe Modification */

export async function update_recipe(recipe_id, recipe) {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .update({
        category_id: recipe.category_id,
        name: recipe.name,
        image: recipe.image,
        servings: recipe.servings,
        calories_per_serving: recipe.calories_per_serving,
        prep_time_m: recipe.prep_time_m,
        cook_time_m: recipe.cook_time_m,
        preamble: recipe.preamble,
        source: recipe.source
      })
      .eq('recipe_id', recipe_id)

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error updating recipe:', error.message)
  }
}

async function drop_recipe_ingredients(recipe_id) {
  try {
    const { data, error } = await supabase
      .from('recipe_ingredient')
      .delete()
      .eq('recipe_id', recipe_id)

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error when deleting from recipe_ingredient:', error.message)
  }
}

async function add_recipe_ingredients(ingredients) {
  try {
    const { data, error } = await supabase.from('recipe_ingredient').insert(ingredients)

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error when adding to recipe_ingredient:', error.message)
  }
}
export async function update_recipe_ingredients(recipe_id, ingredients) {
  /* Validate input */

  if (ingredients == null) {
    throw new Error('ingredients is null')
  }

  for (const ingredient of ingredients) {
    if (
      ingredient == null ||
      ingredient.ingredient_id == null ||
      ingredient.quantity == null ||
      ingredient.unit_id == null
    ) {
      throw new Error(`invalid ingredient: ${JSON.stringify(ingredient)}`)
    }
  }

  /* Delete existing recipe ingredients */
  await drop_recipe_ingredients(recipe_id)

  /* Add new recipe ingredients */
  await add_recipe_ingredients(ingredients)
}
