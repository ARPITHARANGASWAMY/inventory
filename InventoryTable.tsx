import * as React from "react";
import {
  DetailsList,
  IColumn,
  IconButton,
  SelectionMode,
  Stack
} from "@fluentui/react";

import { IInventory } from "../../models/IInventory";

export interface IInventoryTableProps {
  items: IInventory[];
  onEdit: (item: IInventory) => void;
  onDelete: (id: number) => void;
}

const InventoryTable: React.FC<IInventoryTableProps> = ({
  items,
  onEdit,
  onDelete
}) => {

  const columns: IColumn[] = [
    {
      key: "Title",
      name: "Item Name",
      fieldName: "Title",
      minWidth: 150,
      isResizable: true
    },
    {
      key: "category",
      name: "Category",
      fieldName: "Category",
      minWidth: 120
    },
    {
      key: "itemType",
      name: "Item Type",
      fieldName: "Item_x0020_Type",
      minWidth: 120
    },
    {
      key: "qty",
      name: "Available Qty",
      fieldName: "field_4",
      minWidth: 100
    },
    {
      key: "minimum",
      name: "Minimum Stock",
      fieldName: "MinimumStock",
      minWidth: 100
    },
    {
      key: "unit",
      name: "Unit",
      fieldName: "Unit",
      minWidth: 80
    },
    {
      key: "status",
      name: "Status",
      fieldName: "Status",
      minWidth: 100
    },
    {
      key: "actions",
      name: "Actions",
      minWidth: 120,
      onRender: (item: IInventory) => (
        <Stack horizontal tokens={{ childrenGap: 8 }}>
          <IconButton
            iconProps={{ iconName: "Edit" }}
            title="Edit"
            onClick={() => onEdit(item)}
          />

          <IconButton
            iconProps={{ iconName: "Delete" }}
            title="Delete"
            onClick={() => {
              if (item.Id) {
                onDelete(item.Id);
              }
            }}
          />
        </Stack>
      )
    }
  ];

  return (
    <DetailsList
      items={items}
      columns={columns}
      selectionMode={SelectionMode.none}
      setKey="inventoryList"
    />
  );
};

export default InventoryTable;