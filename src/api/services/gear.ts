import { GearResDto, GearReqDto } from '../../types/Gear';
import privateClient from '../privateClient';

/**
 * Fetch all gears
 */
const getAllGears = async (): Promise<GearResDto[]> => {
  return privateClient.get('/config/gear').then((res) => res.data);
};

/**
 * Fetch all gears for a specific category
 * @param categoryId ID of the gear category
 */
const getGearsByCategory = async (
  categoryId: number
): Promise<GearResDto[]> => {
  return privateClient
    .get(`/config/gear/category/${categoryId}`)
    .then((res) => res.data);
};

/**
 * Create a new gear
 * @param gear Gear request DTO
 */
const createGear = async (gear: GearReqDto): Promise<GearResDto> => {
  return privateClient.post('/config/gear', gear).then((res) => res.data);
};

/**
 * Edit a gear
 * @param gear Gear response DTO
 */
const editGear = async (gear: GearResDto): Promise<GearResDto> => {
  return privateClient.put('/config/gear/edit', gear).then((res) => res.data);
};

/**
 * Delete a gear by ID
 * @param id gear ID
 */
const deleteGear = async (id: number): Promise<void> => {
  return privateClient.delete(`/config/gear/${id}`).then((res) => res.data);
};

export default {
  getAllGears,
  getGearsByCategory,
  createGear,
  editGear,
  deleteGear,
};
