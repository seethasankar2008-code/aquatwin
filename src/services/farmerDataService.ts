import { getSupabaseClient } from '../lib/supabaseClient';
import { FarmProfile, CropType, SoilType, GrowthStage } from '../types/farm';
import { UserConfiguredField } from '../components/onboarding/AddFieldsStep';

export interface DatabaseFarmRecord {
  id: string;
  user_id: string;
  farm_name: string;
  location_name: string;
  latitude?: number;
  longitude?: number;
  total_area: number;
  area_unit: 'Acres' | 'Hectares';
  water_source: string;
  available_water: number;
  water_unit: 'Litres' | 'Kilolitres';
  irrigation_method: string;
  created_at?: string;
  updated_at?: string;
}

export interface DatabaseFieldRecord {
  id: string;
  farm_id: string;
  user_id: string;
  field_name: string;
  crop_type: string;
  area: number;
  soil_type: string;
  growth_stage: string;
  target_moisture?: number;
  manual_soil_moisture?: number;
  photo_url?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetch all farms belonging to the authenticated farmer (enforced by RLS)
 */
export async function fetchUserFarms(userId: string): Promise<FarmProfile[]> {
  const supabase = getSupabaseClient();
  if (!supabase || !userId) return [];

  try {
    const { data, error } = await supabase
      .from('farms')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching farms from Supabase:', error.message);
      return [];
    }

    if (!data) return [];

    return data.map((record: DatabaseFarmRecord) => ({
      farmName: record.farm_name,
      location: record.location_name,
      totalArea: record.total_area,
      areaUnit: record.area_unit,
      waterSource: record.water_source as any,
      availableWater: record.available_water,
      waterUnit: record.water_unit,
      irrigationMethod: record.irrigation_method as any,
    }));
  } catch (err) {
    console.error('Failed to query user farms:', err);
    return [];
  }
}

/**
 * Save or update a farm profile in Supabase
 */
export async function saveUserFarm(userId: string, farm: FarmProfile): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase || !userId) return null;

  try {
    const payload = {
      user_id: userId,
      farm_name: farm.farmName,
      location_name: farm.location,
      total_area: farm.totalArea,
      area_unit: farm.areaUnit,
      water_source: farm.waterSource,
      available_water: farm.availableWater,
      water_unit: farm.waterUnit,
      irrigation_method: farm.irrigationMethod,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('farms')
      .insert(payload)
      .select('id')
      .single();

    if (error) {
      console.error('Failed to save farm to Supabase:', error.message);
      return null;
    }

    return data?.id || null;
  } catch (err) {
    console.error('Exception saving farm:', err);
    return null;
  }
}

/**
 * Save field plots for a farm
 */
export async function saveFarmFields(
  farmId: string,
  userId: string,
  fields: UserConfiguredField[]
): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (!supabase || !farmId || !userId) return false;

  try {
    // Delete existing fields for this farm before re-inserting
    await supabase.from('fields').delete().eq('farm_id', farmId).eq('user_id', userId);

    const rows = fields.map((f) => ({
      farm_id: farmId,
      user_id: userId,
      field_name: f.name,
      crop_type: f.crop,
      area: f.area,
      soil_type: f.soilType,
      growth_stage: f.growthStage,
      manual_soil_moisture: f.soilMoisture,
      photo_url: f.visualAnalysis?.photoUrl,
    }));

    const { error } = await supabase.from('fields').insert(rows);
    if (error) {
      console.error('Error inserting fields into Supabase:', error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Exception saving fields:', err);
    return false;
  }
}

/**
 * Fetch fields for a given farm
 */
export async function fetchFarmFields(farmId: string, userId: string): Promise<UserConfiguredField[]> {
  const supabase = getSupabaseClient();
  if (!supabase || !farmId || !userId) return [];

  try {
    const { data, error } = await supabase
      .from('fields')
      .select('*')
      .eq('farm_id', farmId)
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error || !data) {
      return [];
    }

    return data.map((r: DatabaseFieldRecord) => ({
      id: r.id,
      name: r.field_name,
      crop: r.crop_type as CropType,
      area: r.area,
      soilType: r.soil_type as SoilType,
      growthStage: r.growth_stage as GrowthStage,
      soilMoisture: r.manual_soil_moisture,
    }));
  } catch (err) {
    console.error('Exception loading fields:', err);
    return [];
  }
}
