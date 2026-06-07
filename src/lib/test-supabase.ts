import { supabase } from '@/integrations/supabase/client';

/**
 * Test user creation and login flow
 * This script creates a test user and verifies the dashboard login works
 */
export async function testSupabaseAuth() {
  console.log('🧪 Testing Supabase Authentication...\n');

  try {
    // Test 1: Check Supabase connection
    console.log('✓ Test 1: Checking Supabase connection...');
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      throw new Error(`Connection failed: ${error.message}`);
    }
    console.log('✓ Supabase connection successful!\n');

    // Test 2: Create a test user via Edge Function
    console.log('✓ Test 2: Creating test user...');
    const testUser = {
      name: 'Test Warrior',
      age: 25,
      password: 'TestPassword123',
    };

    const { data: signupData, error: signupError } = await supabase.functions.invoke('signup', {
      body: testUser,
    });

    if (signupError) {
      console.error('❌ Signup failed:', signupError.message);
      throw signupError;
    }

    if (signupData?.error) {
      console.error('❌ Signup error:', signupData.error);
      throw new Error(signupData.error);
    }

    console.log('✓ Test user created successfully!');
    console.log('  User ID:', signupData.user.id);
    console.log('  User Name:', signupData.user.name);
    console.log('  Hex ID:', signupData.user.hex_id);
    console.log('  Age:', signupData.user.age, '\n');

    // Test 3: Login with the created user
    console.log('✓ Test 3: Testing login...');
    const { data: loginData, error: loginError } = await supabase.functions.invoke('login', {
      body: {
        name: testUser.name,
        password: testUser.password,
      },
    });

    if (loginError) {
      console.error('❌ Login failed:', loginError.message);
      throw loginError;
    }

    if (loginData?.error) {
      console.error('❌ Login error:', loginData.error);
      throw new Error(loginData.error);
    }

    console.log('✓ Login successful!');
    console.log('  Session Access Token:', loginData.session.access_token.substring(0, 20) + '...');
    console.log('  User:', loginData.user.name, '\n');

    // Test 4: Verify user in database
    console.log('✓ Test 4: Verifying user in database...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('hex_id', signupData.user.hex_id)
      .single();

    if (userError) {
      console.error('❌ User verification failed:', userError.message);
      throw userError;
    }

    console.log('✓ User found in database!');
    console.log('  ID:', userData.id);
    console.log('  Name:', userData.name);
    console.log('  Age:', userData.age);
    console.log('  Belt Level:', userData.belt_level || 'Not set');
    console.log('  Created At:', new Date(userData.created_at).toLocaleString(), '\n');

    // Test 5: Verify authentication session can be set
    console.log('✓ Test 5: Setting authentication session...');
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: loginData.session.access_token,
      refresh_token: loginData.session.refresh_token,
    });

    if (sessionError) {
      console.error('❌ Session setting failed:', sessionError.message);
      throw sessionError;
    }

    console.log('✓ Session set successfully!');
    const { data: sessionData } = await supabase.auth.getSession();
    console.log('  Session user:', sessionData.session?.user?.id, '\n');

    console.log('✅ All tests passed! Supabase is correctly configured.\n');
    console.log('📋 Test Results Summary:');
    console.log('  - Connection: ✓');
    console.log('  - User Creation: ✓');
    console.log('  - Login: ✓');
    console.log('  - Database Verification: ✓');
    console.log('  - Session Management: ✓\n');
    console.log('🎉 You can now use this test user to login to the dashboard:');
    console.log(`  Name: ${testUser.name}`);
    console.log(`  Password: ${testUser.password}`);
    console.log('  Hex ID:', signupData.user.hex_id, '\n');

    return {
      success: true,
      testUser: testUser,
      createdUser: signupData.user,
      session: loginData.session,
    };

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
    throw error;
  }
}

export default testSupabaseAuth;
