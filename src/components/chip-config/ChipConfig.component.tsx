import AddIcon from '@mui/icons-material/Add';
import { Button, Chip } from '@mui/material';
import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import AddItemModal from '../modals/add-item/AddItemModal.component';
import * as Styled from './ChipConfig.styles';
import { GenericConfig } from '../../types/GenericConfig';
import { DeleteModal } from '../modals/delete-modal/DeleteModal.component';

interface ChipConfigProps {
  title: string;
  className?: string;
  items: GenericConfig[];
  onAdd: (item: string) => void;
  onRemove?: (id: number) => void;
}

const ChipConfigComponent: React.FC<ChipConfigProps> = ({
  title,
  className,
  items,
  onAdd,
  onRemove,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteModalProps, setDeleteModalProps] = useState<{
    isOpen: boolean;
    itemId: number;
  }>({
    isOpen: false,
    itemId: 0,
  });

  const handleAddItem = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  return (
    <Styled.ChipConfigContainer
      className={classNames('chip-config', className)}
    >
      <Button
        className="chip-config__add-btn"
        variant="contained"
        onClick={handleAddItem}
      >
        Add item <AddIcon />
      </Button>
      <div className="chip-config__items">
        {items.map((item) => (
          <Chip
            key={item.id}
            className="chip-config__items__item"
            label={item.value}
            onDelete={() =>
              setDeleteModalProps({ isOpen: true, itemId: item?.id ?? 0 })
            }
            variant="outlined"
          />
        ))}
      </div>
      <AddItemModal
        key={`add-item-modal-${isAddModalOpen}`}
        isOpen={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        onConfirm={(item: string) => {
          onAdd(item);
          setIsAddModalOpen(false);
        }}
        text={`Dodaj ${title}`}
      />
      <DeleteModal
        title={'Da li si siguran da zelis da izbrises'}
        isOpen={deleteModalProps?.isOpen}
        onConfirm={() => {
          onRemove?.(deleteModalProps.itemId);
          setDeleteModalProps({ isOpen: false, itemId: 0 });
        }}
        onCancel={() => setDeleteModalProps({ isOpen: false, itemId: 0 })}
      />
    </Styled.ChipConfigContainer>
  );
};

export default ChipConfigComponent;
