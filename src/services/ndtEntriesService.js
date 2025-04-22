// src/services/ndtEntriesService.js
import { supabase } from '../lib/supabase';

/**
 * Get all NDT entries for a user
 * @param {string} userId - User ID
 * @returns {Promise} - Array of NDT entries
 */
export const getUserEntries = async (userId) => {
  const { data, error } = await supabase
    .from('ndt_entries')
    .select('*')
    .eq('user_id', userId)
    .order('entry_date', { ascending: false });
    
  if (error) throw error;
  return data;
};

/**
 * Get a single NDT entry by ID
 * @param {string} entryId - Entry ID
 * @returns {Promise} - NDT entry
 */
export const getEntryById = async (entryId) => {
  const { data, error } = await supabase
    .from('ndt_entries')
    .select('*')
    .eq('id', entryId)
    .single();
    
  if (error) throw error;
  return data;
};

/**
 * Create a new NDT entry
 * @param {Object} entry - Entry data
 * @returns {Promise} - Created entry
 */
export const createEntry = async (entry) => {
  const { data, error } = await supabase
    .from('ndt_entries')
    .insert([entry])
    .select();
    
  if (error) throw error;
  return data[0];
};

/**
 * Update an NDT entry
 * @param {string} entryId - Entry ID
 * @param {Object} updates - Entry updates
 * @returns {Promise} - Updated entry
 */
export const updateEntry = async (entryId, updates) => {
  const { data, error } = await supabase
    .from('ndt_entries')
    .update(updates)
    .eq('id', entryId)
    .select();
    
  if (error) throw error;
  return data[0];
};

/**
 * Delete an NDT entry
 * @param {string} entryId - Entry ID
 * @returns {Promise} - Deletion result
 */
export const deleteEntry = async (entryId) => {
  // First check if the entry has any signatures
  const { data: signatures, error: sigError } = await supabase
    .from('ndt_signatures')
    .select('id')
    .eq('entry_id', entryId);
    
  if (sigError) throw sigError;
  
  // If signatures exist, delete them first
  if (signatures && signatures.length > 0) {
    const { error: deleteSigError } = await supabase
      .from('ndt_signatures')
      .delete()
      .eq('entry_id', entryId);
      
    if (deleteSigError) throw deleteSigError;
  }
  
  // Now delete the entry
  const { error } = await supabase
    .from('ndt_entries')
    .delete()
    .eq('id', entryId);
    
  if (error) throw error;
  return { success: true };
};

/**
 * Calculate total hours by method for a user
 * @param {string} userId - User ID
 * @returns {Promise} - Object with method totals
 */
export const calculateTotalsByMethod = async (userId) => {
  const { data, error } = await supabase
    .from('ndt_entries')
    .select('method, hours')
    .eq('user_id', userId);
    
  if (error) throw error;
  
  // Calculate totals
  const totals = {};
  
  data.forEach(entry => {
    const method = entry.method;
    const hours = parseFloat(entry.hours) || 0;
    
    if (!totals[method]) {
      totals[method] = 0;
    }
    
    totals[method] += hours;
  });
  
  return totals;
};

/**
 * Get entries with additional filtering
 * @param {string} userId - User ID
 * @param {Object} filters - Filter criteria
 * @returns {Promise} - Filtered entries
 */
export const getFilteredEntries = async (userId, filters = {}) => {
  let query = supabase
    .from('ndt_entries')
    .select('*')
    .eq('user_id', userId);
  
  // Apply filters
  if (filters.method) {
    query = query.eq('method', filters.method);
  }
  
  if (filters.company) {
    query = query.eq('company', filters.company);
  }
  
  if (filters.dateFrom) {
    query = query.gte('entry_date', filters.dateFrom);
  }
  
  if (filters.dateTo) {
    query = query.lte('entry_date', filters.dateTo);
  }
  
  // Execute query
  const { data, error } = await query.order('entry_date', { ascending: false });
  
  if (error) throw error;
  return data;
};

/**
 * Check if an entry has a signature
 * @param {string} entryId - Entry ID
 * @returns {Promise} - Boolean indicating if entry has signature
 */
export const hasSignature = async (entryId) => {
  const { data, error } = await supabase
    .from('ndt_signatures')
    .select('id')
    .eq('entry_id', entryId)
    .single();
    
  if (error && error.code !== 'PGRST116') {
    // PGRST116 is the error code for no rows returned
    throw error;
  }
  
  return !!data;
};