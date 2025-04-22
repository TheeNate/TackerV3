// src/services/authService.js
import { supabase } from '../lib/supabase';

/**
 * Sign up a new user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {Object} metadata - Additional user data like full_name, username
 * @returns {Promise} - Signup result
 */
export const signUp = async (email, password, metadata) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  
  if (error) throw error;
  return data;
};

/**
 * Sign in a user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} - Login result
 */
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

/**
 * Sign out the current user
 * @returns {Promise} - Logout result
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/**
 * Get the current logged in user
 * @returns {Promise} - Current user
 */
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data?.user;
};

/**
 * Get the current session
 * @returns {Promise} - Current session
 */
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

/**
 * Reset password
 * @param {string} email - User's email
 * @returns {Promise} - Reset result
 */
export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  
  if (error) throw error;
  return data;
};

/**
 * Update user password
 * @param {string} newPassword - New password
 * @returns {Promise} - Update result
 */
export const updatePassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  if (error) throw error;
  return data;
};

/**
 * Check if user has admin role
 * @param {Object} user - User object
 * @returns {Boolean} - True if user is admin
 */
export const isAdmin = (user) => {
  return user?.user_metadata?.is_admin === true;
};