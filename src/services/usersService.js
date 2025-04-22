// src/services/userService.js
import { supabase } from '../lib/supabase';

/**
 * Get user profile by user ID
 * @param {string} userId - User ID
 * @returns {Promise} - User profile
 */
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  return data;
};

/**
 * Create a new user profile
 * @param {Object} profile - Profile data
 * @returns {Promise} - Created profile
 */
export const createUserProfile = async (profile) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([profile])
    .select();
    
  if (error) throw error;
  return data[0];
};

/**
 * Update user profile
 * @param {string} userId - User ID
 * @param {Object} updates - Profile updates
 * @returns {Promise} - Updated profile
 */
export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select();
    
  if (error) throw error;
  return data[0];
};

/**
 * Get all user profiles (admin only)
 * @returns {Promise} - Array of user profiles
 */
export const getAllProfiles = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

/**
 * Delete a user profile (admin only)
 * @param {string} userId - User ID
 * @returns {Promise} - Deletion result
 */
export const deleteUserProfile = async (userId) => {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId);
    
  if (error) throw error;
  return { success: true };
};

/**
 * Toggle admin status (admin only)
 * @param {string} userId - User ID
 * @param {boolean} isAdmin - New admin status
 * @returns {Promise} - Update result
 */
export const toggleAdminStatus = async (userId, isAdmin) => {
  // First update auth metadata
  const { error: authError } = await supabase.auth.admin.updateUserById(
    userId,
    { user_metadata: { is_admin: isAdmin } }
  );
  
  if (authError) throw authError;
  
  // Then update profile
  const { data, error } = await supabase
    .from('profiles')
    .update({ is_admin: isAdmin })
    .eq('id', userId)
    .select();
    
  if (error) throw error;
  return data[0];
};