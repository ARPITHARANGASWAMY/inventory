import * as React from "react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogType,
  DialogFooter,
  TextField,
  Dropdown,
  IDropdownOption,
  PrimaryButton,
  DefaultButton,
  Stack
} from "@fluentui/react";

import { IInventory } from "../../models/IInventory";

export interface IInventoryFormProps {
  isOpen: boolean;
  item?: IInventory;
  onSave: (item: IInventory) => Promise<void>;
  onCancel: () => void;
}

const categoryOptions: IDropdownOption[] = [
  { key: "IT", text: "IT" },
  { key: "Furniture", text: "Furniture" },
  { key: "Stationery", text: "Stationery" }
];

const itemTypeOptions: IDropdownOption[] = [
  { key: "Consumable", text: "Consumable" },
  { key: "Non Consumable", text: "Non Consumable" }
];

const unitOptions: IDropdownOption[] = [
  { key: "Nos", text: "Nos" },
  { key: "Box", text: "Box" },
  { key: "Kg", text: "Kg" }
];

const statusOptions: IDropdownOption[] = [
  { key: "Active", text: "Active" },
  { key: "Inactive", text: "Inactive" }
];

const emptyItem: IInventory = {
  Title: "",
  Category: "",
  Item_x0020_Type: "",
  field_4: 0,
  field_5: 0,
  field_7: "",
  field_10: "Active",
  Description: ""
};

const InventoryForm: React.FC<IInventoryFormProps> = ({
  isOpen,
  item,
  onSave,
  onCancel
}) => {

  const [inventory, setInventory] = useState<IInventory>(emptyItem);

  useEffect(() => {

    if (item) {
      setInventory(item);
    } else {
      setInventory(emptyItem);
    }

  }, [item, isOpen]);

  const updateField = (field: keyof IInventory, value: unknown): void => {

    setInventory({
      ...inventory,
      [field]: value
    });

  };

  const validate = (): boolean => {

    if (!inventory.Title.trim()) {
      alert("Item Name is required");
      return false;
    }

    if (!inventory.Category) {
      alert("Category is required");
      return false;
    }

    if (!inventory.Item_x0020_Type) {
      alert("Item Type is required");
      return false;
    }

    if (inventory.field_4 < 0) {
      alert("Quantity cannot be negative");
      return false;
    }

    if (inventory.field_5 < 0) {
      alert("Minimum Stock cannot be negative");
      return false;
    }

    return true;
  };

  const save = async (): Promise<void> => {

    if (!validate())
      return;

    await onSave(inventory);

  };

  return (

    <Dialog
      hidden={!isOpen}
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: inventory.Id ? "Edit Inventory" : "Add Inventory"
      }}
      minWidth={600}
      onDismiss={onCancel}
    >

      <Stack tokens={{ childrenGap: 15 }}>

        <TextField
          label="Item Name"
          required
          value={inventory.Title}
          onChange={(_, value) =>
            updateField("Title", value || "")
          }
        />

        <Dropdown
          label="Category"
          required
          options={categoryOptions}
          selectedKey={inventory.Category}
          onChange={(_, option) =>
            updateField("Category", option?.key)
          }
        />

        <Dropdown
          label="Item Type"
          required
          options={itemTypeOptions}
          selectedKey={inventory.Item_x0020_Type}
          onChange={(_, option) =>
            updateField("Item_x0020_Type", option?.key)
          }
        />

        <TextField
          label="Available Quantity"
          type="number"
          value={inventory.field_4.toString()}
          onChange={(_, value) =>
            updateField(
              "field_4",
              Number(value)
            )
          }
        />

        <TextField
          label="Minimum Stock"
          type="number"
          value={inventory.field_5.toString()}
          onChange={(_, value) =>
            updateField(
              "field_5",
              Number(value)
            )
          }
        />

        <Dropdown
          label="Unit"
          options={unitOptions}
          selectedKey={inventory.field_7}
          onChange={(_, option) =>
            updateField("field_7", option?.key)
          }
        />

        <Dropdown
          label="Status"
          options={statusOptions}
          selectedKey={inventory.field_10}
          onChange={(_, option) =>
            updateField("field_10", option?.key)
          }
        />

        <TextField
          label="Description"
          multiline
          rows={4}
          value={inventory.Description}
          onChange={(_, value) =>
            updateField("Description", value || "")
          }
        />

      </Stack>

      <DialogFooter>

        <PrimaryButton
          text="Save"
          onClick={save}
        />

        <DefaultButton
          text="Cancel"
          onClick={onCancel}
        />

      </DialogFooter>

    </Dialog>

  );

};

export default InventoryForm;