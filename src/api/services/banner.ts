import { BannerLocation, CreateBannerData } from '../../types/Banner';
import client from '../client';
import privateClient from '../privateClient';

const getAll = async () =>
    privateClient.get('/banners/getAll').then((res) => res.data);

const deleteBanner = async (bannerId: number) =>
    privateClient.delete(`/banners/delete/${bannerId}`).then((res) => res.data);

const createBanner = async (banner: CreateBannerData) =>
    privateClient.post(`/banners/create`, banner).then((res) => res.data);

const publishBanner = async (bannerId: number, pages: BannerLocation[]) =>
    privateClient
        .post(`/banners/publish/${bannerId}`, pages)
        .then((res) => res.data);

const unpublishBanner = async (bannerId: number) =>
    privateClient
        .post(`/banners/unpublish/${bannerId}`)
        .then((res) => res.data);

const getActiveForPage = async (page: BannerLocation) =>
    client.get(`/banners/active/${page}`).then((res) => res.data);

export default {
    getAll,
    deleteBanner,
    createBanner,
    publishBanner,
    unpublishBanner,
    getActiveForPage,
};
