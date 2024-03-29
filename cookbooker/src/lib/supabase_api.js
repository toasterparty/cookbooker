import { supabase } from './supabase_client'

/* Helper */

export function sort_by_name(list) {
  return list.sort((a, b) => {
    const name_a = a.name ? a.name.toLowerCase() : ''
    const name_b = b.name ? b.name.toLowerCase() : ''
    if (name_a > name_b) return 1
    if (name_a < name_b) return -1
    return 0
  })
}

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
  return sort_by_name(data)
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
        step_id: data[i].step_id,
        step_type: step_type.name,
        step_type_id: step.step_type_id,
        step_num: data[i].step_num,
        description: step.description,
        duration_m: step.duration_m,
        image: step.image
      })
    }

    return steps
  } catch (error) {
    console.error('Error fetching steps:', error.message)
  }
}

export async function get_tag(tag_id) {
  try {
    const { data, error } = await supabase.from('tags').select('*').eq('tag_id', tag_id).single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error fetching tag:', error.message)
  }
}

export async function get_tags_for_recipe(recipe_id) {
  try {
    const { data, error } = await supabase.from('recipe_tag').select('*').eq('recipe_id', recipe_id)

    if (error) {
      throw error
    }

    const tags = []
    for (var i = 0; i < data.length; i++) {
      const tag = await get_tag(data[i].tag_id)
      tags.push(tag)
    }

    return tags
  } catch (error) {
    console.error('Error fetching tags for recipe:', error.message)
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

export async function search_ingredient(query) {
  try {
    const { data, error } = await supabase.from('ingredients').select().ilike('name', `%${query}%`)

    if (error) {
      throw error
    }

    return sort_by_name(data)
  } catch (error) {
    console.error('Error searching for ingredient:', error.message)
  }

  return null
}

export async function search_tag(query) {
  try {
    const { data, error } = await supabase.from('tags').select().ilike('name', `%${query}%`)

    if (error) {
      throw error
    }

    return sort_by_name(data)
  } catch (error) {
    console.error('Error searching for ingredient:', error.message)
  }

  return null
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

    return sort_by_name(data)
  } catch (error) {
    console.error('Error fetching units:', error.message)
  }
}

export async function get_step_types() {
  try {
    const { data, error } = await supabase.from('step_types').select('*')

    if (error) {
      throw error
    }

    return sort_by_name(data)
  } catch (error) {
    console.error('Error fetching step types:', error.message)
  }
}

export async function get_tags() {
  try {
    const { data, error } = await supabase.from('tags').select('*')

    if (error) {
      throw error
    }

    return sort_by_name(data)
  } catch (error) {
    console.error('Error fetching tags:', error.message)
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

    return sort_by_name(data)
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
        numerator: recipe_ingredients[i].numerator,
        denominator: recipe_ingredients[i].denominator,
        alias: recipe_ingredients[i].alias,
        units: units
      })
    }

    return sort_by_name(ingredients)
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

    return sort_by_name(data)
  } catch (error) {
    console.error('Error fetching categories:', error.message)
  }
}

/* Category Modification */

async function insert_category(category) {
  try {
    const { data, error } = await supabase.from('categories').insert([category]).select()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error when adding new category:', error.message)
  }
}

async function update_category(category) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('category_id', category.category_id)
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error when updating category:', error.message)
  }
}

async function remove_category(category_id) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .delete()
      .eq('category_id', category_id)
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error when deleting from categories:', error.message)
  }
}

export async function update_categories(upsert_categories, remove_categories) {
  /* Validate Input */

  for (const category of upsert_categories) {
    if (category == null || category.name == null || category.category_id === null) {
      throw new Error(`invalid category: ${JSON.stringify(category)}`)
    }
  }

  for (const category of remove_categories) {
    if (category == null || category.category_id == null) {
      throw new Error(`invalid category: ${JSON.stringify(category)}`)
    }
  }

  /* Add/modify Categories */

  for (const category of upsert_categories) {
    if (category.category_id === undefined) {
      await insert_category(category)
    } else {
      await update_category(category)
    }
  }

  /* Remove categories */

  for (const category of remove_categories) {
    await remove_category(category.category_id)
  }
}

/* Unit Modification */

async function insert_unit(unit) {
  try {
    const { data, error } = await supabase.from('units').insert([unit]).select()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error when adding new unit:', error.message)
  }
}

async function update_unit(unit) {
  try {
    const { data, error } = await supabase
      .from('units')
      .update(unit)
      .eq('unit_id', unit.unit_id)
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error when updating unit:', error.message)
  }
}

async function remove_unit(unit_id) {
  try {
    const { data, error } = await supabase.from('units').delete().eq('unit_id', unit_id).single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error when deleting from units:', error.message)
  }
}

export async function update_units(upsert_units, remove_units) {
  /* Validate Input */

  for (const unit of upsert_units) {
    if (unit == null || unit.name == null || unit.unit_id === null) {
      throw new Error(`invalid unit: ${JSON.stringify(unit)}`)
    }
  }

  for (const unit of remove_units) {
    if (unit == null || unit.unit_id == null) {
      throw new Error(`invalid unit: ${JSON.stringify(unit)}`)
    }
  }

  /* Add/modify units */

  for (const unit of upsert_units) {
    if (unit.unit_id === undefined) {
      await insert_unit(unit)
    } else {
      await update_unit(unit)
    }
  }

  /* Remove units */

  for (const unit of remove_units) {
    await remove_unit(unit.unit_id)
  }
}

/* Ingredient Modification */

export async function insert_ingredient(ingredient) {
  try {
    const { data, error } = await supabase.from('ingredients').insert([ingredient]).select()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error adding new ingredient:', error.message)
  }
}

async function update_ingredient(ingredient) {
  try {
    const { data, error } = await supabase
      .from('ingredients')
      .update(ingredient)
      .eq('ingredient_id', ingredient.ingredient_id)
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error when updating ingredient:', error.message)
  }
}

async function remove_ingredient(ingredient_id) {
  try {
    const { data, error } = await supabase
      .from('ingredients')
      .delete()
      .eq('ingredient_id', ingredient_id)
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error when deleting from ingredients:', error.message)
  }
}

export async function update_ingredients(upsert_ingredients, remove_ingredients) {
  /* Validate Input */

  for (const ingredient of upsert_ingredients) {
    if (ingredient == null || ingredient.name == null || ingredient.ingredient_id === null) {
      throw new Error(`invalid ingredient: ${JSON.stringify(ingredient)}`)
    }
  }

  for (const ingredient of remove_ingredients) {
    if (ingredient == null || ingredient.ingredient_id == null) {
      throw new Error(`invalid ingredient: ${JSON.stringify(ingredient)}`)
    }
  }

  /* Add/modify ingredients */

  for (const ingredient of upsert_ingredients) {
    if (ingredient.ingredient_id === undefined) {
      await insert_ingredient(ingredient)
    } else {
      await update_ingredient(ingredient)
    }
  }

  /* Remove ingredients */

  for (const ingredient of remove_ingredients) {
    await remove_ingredient(ingredient.ingredient_id)
  }
}

/* Tag Modification */

export async function insert_tag(tag) {
  try {
    const { data, error } = await supabase.from('tags').insert([tag]).select()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error adding new tag:', error.message)
  }
}

async function update_tag(tag) {
  try {
    const { data, error } = await supabase
      .from('tags')
      .update(tag)
      .eq('tag_id', tag.tag_id)
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error when updating tag:', error.message)
  }
}

async function remove_tag(tag_id) {
  try {
    const { data, error } = await supabase.from('tags').delete().eq('tag_id', tag_id).single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error when deleting from tags:', error.message)
  }
}

export async function update_tags(upsert_tags, remove_tags) {
  /* Validate Input */

  for (const tag of upsert_tags) {
    if (tag == null || tag.name == null || tag.tag_id === null) {
      throw new Error(`invalid tag: ${JSON.stringify(tag)}`)
    }
  }

  for (const tag of remove_tags) {
    if (tag == null || tag.tag_id == null) {
      throw new Error(`invalid tag: ${JSON.stringify(tag)}`)
    }
  }

  /* Add/modify tags */

  for (const tag of upsert_tags) {
    if (tag.tag_id === undefined) {
      await insert_tag(tag)
    } else {
      await update_tag(tag)
    }
  }

  /* Remove tags */

  for (const tag of remove_tags) {
    await remove_tag(tag.tag_id)
  }
}

/* step_type Modification */

async function insert_step_type(step_type) {
  try {
    const { data, error } = await supabase.from('step_types').insert([step_type]).select()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error when adding new step_type:', error.message)
  }
}

async function update_step_type(step_type) {
  try {
    const { data, error } = await supabase
      .from('step_types')
      .update(step_type)
      .eq('step_type_id', step_type.step_type_id)
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error when updating step_type:', error.message)
  }
}

async function remove_step_type(step_type_id) {
  try {
    const { data, error } = await supabase
      .from('step_types')
      .delete()
      .eq('step_type_id', step_type_id)
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error when deleting from step_types:', error.message)
  }
}

export async function update_step_types(upsert_step_types, remove_step_types) {
  /* Validate Input */

  for (const step_type of upsert_step_types) {
    if (step_type == null || step_type.name == null || step_type.step_type_id === null) {
      throw new Error(`invalid step_type: ${JSON.stringify(step_type)}`)
    }
  }

  for (const step_type of remove_step_types) {
    if (step_type == null || step_type.step_type_id == null) {
      throw new Error(`invalid step_type: ${JSON.stringify(step_type)}`)
    }
  }

  /* Add/modify step_types */

  for (const step_type of upsert_step_types) {
    if (step_type.step_type_id === undefined) {
      await insert_step_type(step_type)
    } else {
      await update_step_type(step_type)
    }
  }

  /* Remove step_types */

  for (const step_type of remove_step_types) {
    await remove_step_type(step_type.step_type_id)
  }
}

/* Recipe Modification */

export async function new_recipe() {
  try {
    const { data, error } = await supabase.from('recipes').insert([{}]).select()

    if (error) {
      throw error
    }

    var recipe_id = data[0].recipe_id
    if (recipe_id === null || recipe_id === -1) {
      throw new Error('recipe_id of new step was invalid')
    }

    return recipe_id
  } catch (error) {
    console.error('Error adding new recipe_id:', error.message)
  }
}

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

async function drop_recipe_steps(recipe_id) {
  try {
    const { data, error } = await supabase.from('recipe_step').delete().eq('recipe_id', recipe_id)

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error when deleting from recipe_step:', error.message)
  }
}

async function add_recipe_steps(recipe_steps) {
  try {
    const { data, error } = await supabase.from('recipe_step').insert(recipe_steps)

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error when adding to recipe_step:', error.message)
  }
}

export async function update_recipe_steps(recipe_id, recipe_steps) {
  /* Validate input */

  if (recipe_steps == null) {
    throw new Error('recipe_steps is null')
  }

  for (const recipe_step of recipe_steps) {
    if (
      recipe_step == null ||
      recipe_step.recipe_id == null ||
      recipe_step.step_id == null ||
      recipe_step.step_num == null
    ) {
      throw new Error(`invalid recipe_step: ${JSON.stringify(step)}`)
    }
  }

  /* Delete existing recipe ingredients */
  await drop_recipe_steps(recipe_id)

  /* Add new recipe ingredients */
  await add_recipe_steps(recipe_steps)
}

async function update_step(step) {
  try {
    if (step == null || step.step_type_id == null || step.description == null) {
      throw new Error(`invalid step: ${JSON.stringify(step)}`)
    }

    const { data, error } = await supabase
      .from('steps')
      .update([
        {
          step_type_id: step.step_type_id,
          description: step.description,
          image: step.image,
          duration_m: step.duration_m
        }
      ])
      .eq('step_id', step.step_id)
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error when updating step:', error.message)
  }
}

export async function update_steps(steps) {
  if (steps == null) {
    throw new Error('steps is null')
  }

  for (const step of steps) {
    await update_step(step)
  }
}

export async function new_step() {
  try {
    const { data, error } = await supabase.from('steps').insert([{}]).select()

    if (error) {
      throw error
    }

    var step_id = data[0].step_id
    if (step_id === null || step_id === -1) {
      throw new Error('step_id of new step was invalid')
    }

    return step_id
  } catch (error) {
    console.error('Error adding new step:', error.message)
  }
}

export async function update_recipe_tags(recipe_id, recipe_tags) {
  /* Validate input */

  if (recipe_tags == null) {
    throw new Error('tags is null')
  }

  var data = []
  for (const tag of recipe_tags) {
    if (tag == null || tag.tag_id == null) {
      throw new Error(`invalid recipe_tags: ${JSON.stringify(recipe_tags)}`)
    }

    data.push({
      recipe_id: recipe_id,
      tag_id: tag.tag_id
    })
  }

  /* Delete existing recipe ingredients */
  await drop_recipe_tags(recipe_id)

  /* Add new recipe ingredients */
  await add_recipe_tags(data)
}

async function drop_recipe_tags(recipe_id) {
  try {
    const { data, error } = await supabase.from('recipe_tag').delete().eq('recipe_id', recipe_id)

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error when deleting from recipe_tag:', error.message)
  }
}

async function add_recipe_tags(recipe_tags) {
  try {
    const { data, error } = await supabase.from('recipe_tag').insert(recipe_tags)

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error when adding to recipe_tag:', error.message)
  }
}
