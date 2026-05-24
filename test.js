import { supabase } from './src/lib/supabase.js'

async function test() {
  const { data, error } = await supabase
    .from('products')
    .select('*')

  console.log(data, error)
}

test()