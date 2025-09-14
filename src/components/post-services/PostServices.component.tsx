import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import postServiceApi from '../../api/services/postServiceApi';
import { PostServiceReqDto } from '../../types/PostService';
import { DeleteModal } from '../modals/delete-modal/DeleteModal.component';
import PostServiceModal from '../modals/post-service/PostServiceModal.component';
import * as Styled from './PostServices.styles';

interface PostServiceModalProps {
  isOpen: boolean;
  postServiceProp?: PostServiceReqDto;
  onCancel: () => void;
  onSubmit: (postService: PostServiceReqDto) => void;
}

const closedModalProps: PostServiceModalProps = {
  isOpen: false,
  onCancel: () => {},
  onSubmit: () => {},
};

const closedDeleteModalProps = {
  isOpen: false,
  itemId: 0,
};

const PostService = () => {
  const [postServiceModalProps, setPostServiceModalProps] =
    useState<PostServiceModalProps>(closedModalProps);
  console.log({ postServiceModalProps });

  const [postServices, setPostServices] = useState<PostServiceReqDto[]>([]);

  const [deleteModalProps, setDeleteModalProps] = useState<{
    isOpen: boolean;
    itemId: number;
  }>(closedDeleteModalProps);

  const handleAddPostService = useCallback(
    async (postService: PostServiceReqDto) => {
      try {
        const response = await postServiceApi.createPostService(postService);
        setPostServices((old) => [...old, response]);
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  const handleEditPostService = useCallback(
    async (postServiceToEdit: PostServiceReqDto) => {
      if (!postServiceToEdit) return;

      const response = await postServiceApi.editPostService({
        id: postServiceToEdit?.id,
        name: postServiceToEdit?.name,
        websiteUrl: postServiceToEdit?.websiteUrl,
      });
      setPostServices((old) =>
        old.map((x) => (x.id === response.id ? response : x))
      );
      setPostServiceModalProps(closedModalProps);
    },
    []
  );

  const handleDeletePostService = useCallback(async () => {
    await postServiceApi.deletePostService(deleteModalProps.itemId);
    setPostServices((old) =>
      old.filter((x) => x.id !== deleteModalProps.itemId)
    );

    setDeleteModalProps(closedDeleteModalProps);
  }, [deleteModalProps.itemId]);

  const fetchPostServices = useCallback(async () => {
    try {
      const response = await postServiceApi.getAllPostServices();
      setPostServices(response);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchPostServices();
  }, [fetchPostServices]);

  return (
    <Styled.PostServicesContainer className="post_services">
      <Button
        className="post_services__add-btn"
        variant="contained"
        onClick={() =>
          setPostServiceModalProps({
            isOpen: true,
            onCancel: () => setPostServiceModalProps(closedModalProps),
            onSubmit: (postService: PostServiceReqDto) => {
              handleAddPostService(postService);
              setPostServiceModalProps(closedModalProps);
            },
          })
        }
      >
        Add item <AddIcon />
      </Button>
      <Table className="post_services__table">
        <TableHead>
          <TableRow>
            <TableCell className="post_services__table__header-cell">
              Name
            </TableCell>
            <TableCell className="post_services__table__header-cell">
              Website
            </TableCell>
            <TableCell sx={{ borderBottom: 'none' }}></TableCell>
            <TableCell sx={{ borderBottom: 'none' }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {postServices?.map((postService) => (
            <TableRow
              key={postService.id}
              hover
              className="post_services__table__body__row"
            >
              <TableCell>{postService.name}</TableCell>
              <TableCell>{postService.websiteUrl}</TableCell>
              <TableCell className="post_services__table__body__row__action-cell">
                <IconButton
                  onClick={() => {
                    setPostServiceModalProps({
                      isOpen: true,
                      postServiceProp: postService,
                      onCancel: () => {
                        setPostServiceModalProps(closedModalProps);
                      },
                      onSubmit: (postService: PostServiceReqDto) => {
                        handleEditPostService(postService);
                      },
                    });
                  }}
                >
                  <EditIcon />
                </IconButton>
              </TableCell>
              <TableCell className="post_services__table__body__row__action-cell">
                <IconButton
                  onClick={() =>
                    setDeleteModalProps({
                      isOpen: true,
                      itemId: postService.id ?? 0,
                    })
                  }
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {postServiceModalProps.isOpen && (
        <PostServiceModal {...postServiceModalProps} />
      )}
      <DeleteModal
        title={'Da li si siguran da zelis da izbrises'}
        isOpen={deleteModalProps?.isOpen}
        onConfirm={handleDeletePostService}
        onCancel={() => setDeleteModalProps(closedDeleteModalProps)}
      />
    </Styled.PostServicesContainer>
  );
};

export default PostService;
