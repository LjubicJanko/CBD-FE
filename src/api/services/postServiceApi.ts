import { PostServiceReqDto } from '../../types/PostService';
import privateClient from '../privateClient';

const getAllPostServices = async (): Promise<PostServiceReqDto[]> => {
  return privateClient.get('/postService').then((res) => res.data);
};

const createPostService = async (
  postService: PostServiceReqDto
): Promise<PostServiceReqDto> => {
  return privateClient
    .post('/postService', postService)
    .then((res) => res.data);
};

const editPostService = async (postService: PostServiceReqDto): Promise<PostServiceReqDto> => {
  return privateClient.put('/postService/edit', postService).then((res) => res.data);
};

const deletePostService = async (id: number): Promise<void> => {
  return privateClient.delete(`/postService/${id}`).then((res) => res.data);
};

export default {
  getAllPostServices,
  createPostService,
  editPostService,
  deletePostService
};
