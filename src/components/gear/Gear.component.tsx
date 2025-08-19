import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Button,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import gearService from '../../api/services/gear';
import { GearReqDto, GearResDto } from '../../types/Gear';
import { GenericConfig } from '../../types/GenericConfig';
import { DeleteModal } from '../modals/delete-modal/DeleteModal.component';
import { GearModal, GearModalProps } from '../modals/gear/GearModal.component';
import * as Styled from './Gear.styles';

const closedDeleteModalProps = {
  isOpen: false,
  itemId: 0,
};

const closedGearModalProps: Omit<GearModalProps, 'gearCategories'> = {
  title: '',
  isOpen: false,
  onConfirm: () => {},
  onCancel: () => {},
};

export interface GearProps {
  gears: GearResDto[];
  gearCategories: GenericConfig[];
  isLoading?: boolean;
  setGears: Dispatch<SetStateAction<GearResDto[]>>;
}

const Gear = ({
  gears,
  gearCategories,
  isLoading = false,
  setGears,
}: GearProps) => {
  const [deleteModalProps, setDeleteModalProps] = useState<{
    isOpen: boolean;
    itemId: number;
  }>(closedDeleteModalProps);

  const [gearModalProps, setGearModalProps] =
    useState<Omit<GearModalProps, 'gearCategories'>>(closedGearModalProps);

  const handleAddGear = useCallback(
    async (gearToCreate: GearReqDto) => {
      const response = await gearService.createGear(gearToCreate);
      setGears((old) => [...old, response]);
      setGearModalProps(closedGearModalProps);
    },
    [setGears]
  );

  const handleEditGear = useCallback(
    async (gearToEdit: GearResDto) => {
      if (!gearToEdit) return;

      const response = await gearService.editGear({
        id: gearToEdit?.id,
        name: gearToEdit?.name,
        categoryId: gearToEdit?.categoryId,
        categoryName: gearToEdit?.categoryName,
      });
      setGears((old) => old.map((x) => (x.id === response.id ? response : x)));
      setGearModalProps(closedGearModalProps);
    },
    [setGears]
  );

  const handleDeleteGear = useCallback(async () => {
    await gearService.deleteGear(deleteModalProps.itemId);
    setGears((old) => old.filter((x) => x.id !== deleteModalProps.itemId));

    setDeleteModalProps(closedDeleteModalProps);
  }, [deleteModalProps.itemId, setGears]);

  return (
    <Styled.GearContainer className="gear">
      <Button
        className="gear__add-btn"
        variant="contained"
        onClick={() =>
          setGearModalProps({
            title: 'Dodavanje stavke',
            isOpen: true,
            onCancel: () => setGearModalProps(closedGearModalProps),
            onConfirm: (gearToCreate) =>
              handleAddGear(gearToCreate as GearReqDto),
          })
        }
      >
        Add item <AddIcon />
      </Button>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <Table className="gear__table">
          <TableHead>
            <TableRow>
              <TableCell className="gear__table__header-cell">Name</TableCell>
              <TableCell className="gear__table__header-cell">
                Category
              </TableCell>
              <TableCell sx={{ borderBottom: 'none' }}></TableCell>
              <TableCell sx={{ borderBottom: 'none' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="gear__table__body">
            {gears.map((gear) => (
              <TableRow key={gear.id} hover className="gear__table__body__row">
                <TableCell>{gear.name}</TableCell>
                <TableCell>{gear.categoryName}</TableCell>
                <TableCell className="gear__table__body__row__action-cell">
                  <IconButton
                    onClick={() =>
                      setGearModalProps({
                        title: 'Izmena stavke',
                        isOpen: true,
                        gear: gear,
                        onCancel: () => {
                          setGearModalProps(closedGearModalProps);
                        },
                        onConfirm: (gearToEdit) =>
                          handleEditGear(gearToEdit as GearResDto),
                      })
                    }
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
                <TableCell className="gear__table__body__row__action-cell">
                  <IconButton
                    onClick={() =>
                      setDeleteModalProps({ isOpen: true, itemId: gear.id })
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <GearModal {...gearModalProps} gearCategories={gearCategories} />
      <DeleteModal
        title={'Da li si siguran da zelis da izbrises'}
        isOpen={deleteModalProps?.isOpen}
        onConfirm={handleDeleteGear}
        onCancel={() => setDeleteModalProps(closedDeleteModalProps)}
      />
    </Styled.GearContainer>
  );
};

export default Gear;
