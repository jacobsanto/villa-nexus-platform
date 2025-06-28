
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MockProperty {
  external_id: string;
  name: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  status: 'active' | 'inactive' | 'maintenance';
  nightly_rate: number;
  image_url?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user from JWT token
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError || !user) {
      console.log('Authentication failed:', authError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('User authenticated:', user.id)

    // Get user profile to check role and tenant_id
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role, tenant_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      console.log('Profile fetch error:', profileError)
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if user is admin
    if (profile.role !== 'admin') {
      console.log('User role insufficient:', profile.role)
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions. Admin role required.' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!profile.tenant_id) {
      return new Response(
        JSON.stringify({ error: 'No tenant associated with user' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('User authorized, tenant_id:', profile.tenant_id)

    // Get tenant's active integration
    const { data: tenantIntegration, error: integrationError } = await supabaseClient
      .from('tenant_integrations')
      .select(`
        *,
        integrations (name, id)
      `)
      .eq('tenant_id', profile.tenant_id)
      .eq('is_active', true)
      .single()

    if (integrationError || !tenantIntegration) {
      console.log('Integration fetch error:', integrationError)
      return new Response(
        JSON.stringify({ error: 'No active PMS integration found for tenant' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Active integration found:', tenantIntegration.integrations.name)

    // Dynamic dispatch based on PMS platform
    let mockProperties: MockProperty[] = []
    
    switch (tenantIntegration.integrations.name) {
      case 'Guesty':
        // TODO: Implement Guesty API call here
        console.log('Syncing with Guesty (mock data)')
        mockProperties = [
          {
            external_id: 'guesty_001',
            name: 'Luxury Downtown Apartment',
            address: '123 Main St, New York, NY 10001',
            bedrooms: 2,
            bathrooms: 2,
            status: 'active',
            nightly_rate: 150,
            image_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
          },
          {
            external_id: 'guesty_002',
            name: 'Cozy Beach House',
            address: '456 Ocean Drive, Miami, FL 33139',
            bedrooms: 3,
            bathrooms: 2,
            status: 'active',
            nightly_rate: 200,
            image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop'
          },
          {
            external_id: 'guesty_003',
            name: 'Mountain Cabin Retreat',
            address: '789 Pine Trail, Aspen, CO 81611',
            bedrooms: 4,
            bathrooms: 3,
            status: 'maintenance',
            nightly_rate: 300,
            image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop'
          }
        ]
        break;
        
      default:
        throw new Error(`Unsupported PMS platform: ${tenantIntegration.integrations.name}`)
    }

    // Transform mock data to match properties table structure
    const propertiesToUpsert = mockProperties.map(property => ({
      tenant_id: profile.tenant_id,
      integration_id: tenantIntegration.integration_id,
      external_id: property.external_id,
      name: property.name,
      address: property.address,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      status: property.status,
      nightly_rate: property.nightly_rate,
      image_url: property.image_url,
      updated_at: new Date().toISOString()
    }))

    console.log('Upserting properties:', propertiesToUpsert.length)

    // Upsert properties into database
    const { data: upsertedProperties, error: upsertError } = await supabaseClient
      .from('properties')
      .upsert(propertiesToUpsert, {
        onConflict: 'tenant_id,external_id',
        ignoreDuplicates: false
      })
      .select()

    if (upsertError) {
      console.error('Upsert error:', upsertError)
      return new Response(
        JSON.stringify({ error: 'Failed to sync properties: ' + upsertError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Update last_sync_at timestamp
    await supabaseClient
      .from('tenant_integrations')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', tenantIntegration.id)

    console.log('Sync completed successfully')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully synced ${propertiesToUpsert.length} properties from ${tenantIntegration.integrations.name}`,
        count: propertiesToUpsert.length
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Sync function error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
