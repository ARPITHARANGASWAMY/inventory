import * as React from "react";
import { useEffect, useState, useMemo, useCallback } from "react";

import {
  Stack,
  Text,
  SearchBox,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  MessageBar,
  MessageBarType
} from "@fluentui/react";

import { IInventory } from "../../models/IInventory";
import InventoryService from "../../services/InventoryService";
import InventoryTable from "./InventoryTable";
import InventoryForm from "./InventoryForm";

import { getSP } from "../../utils/PnPConfig";
import { IInventoryManagementProps } from "../IInventoryManagementProps";

const Inventory: React.FC<IInventoryManagementProps> = (props) => {

  const sp = getSP(props.context);
  const inventoryService = useMemo(() => new InventoryService(sp), [sp]);

  const [items, setItems] = useState<IInventory[]>([]);
  const [filteredItems, setFilteredItems] = useState<IInventory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [selectedItem, setSelectedItem] = useState<IInventory | undefined>();

  const loadInventory = useCallback(async (): Promise<void> => {

    try {

      setLoading(true);
      setError("");

      const data = await inventoryService.getItems();

      setItems(data);

      setFilteredItems(data);

    }
    catch (error) {

      const errorMessage = error instanceof Error ? error.message : "Failed to load inventory";
      setError(errorMessage);
      console.error(error);

    }
    finally {

      setLoading(false);

    }

  }, [inventoryService]);

  useEffect(() => {

    loadInventory().catch(console.error);

  }, [loadInventory]);

  const onSearch = useCallback(
    (
      event?: React.ChangeEvent<HTMLInputElement>,
      newValue?: string
    ): void => {

      const text = newValue?.toLowerCase() || "";

      const filtered = items.filter(item =>

        (item.Title || "").toLowerCase().includes(text) ||

        String(item.Category).toLowerCase().includes(text) ||

        String(item.Item_x0020_Type).toLowerCase().includes(text)

      );

      setFilteredItems(filtered);

    },
    [items]
  );

  const onAddClick = useCallback((): void => {

    setSelectedItem(undefined);

    setIsDialogOpen(true);

  }, []);

  const onEdit = useCallback((item: IInventory): void => {

    setSelectedItem(item);

    setIsDialogOpen(true);

  }, []);

  const onDelete = useCallback(async (id: number): Promise<void> => {

    if (!confirm("Are you sure you want to delete this item?"))
      return;

    try {
      await inventoryService.deleteItem(id);
      await loadInventory();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete item";
      setError(errorMessage);
    }

  }, [inventoryService, loadInventory]);

  const onSave = useCallback(async (item: IInventory): Promise<void> => {

    try {
      if (item.Id) {

        await inventoryService.updateItem(item);

      }
      else {

        await inventoryService.createItem(item);

      }

      setIsDialogOpen(false);

      await loadInventory();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save item";
      setError(errorMessage);
    }

  }, [inventoryService, loadInventory]);

  const onCancelDialog = useCallback(() => setIsDialogOpen(false), []);

  return (

    <Stack tokens={{ childrenGap: 20 }}>

      <Text variant="xLarge">

        Inventory Management

      </Text>

      {error && (
        <MessageBar messageBarType={MessageBarType.error} onDismiss={() => setError("")}>
          {error}
        </MessageBar>
      )}

      <Stack
        horizontal
        horizontalAlign="space-between"
      >

        <SearchBox

          placeholder="Search Inventory"

          onChange={onSearch}

          styles={{ root: { width: 350 } }}

        />

        <PrimaryButton

          text="Add Item"

          onClick={onAddClick}

        />

      </Stack>

      {

        loading ?

          <Spinner

            size={SpinnerSize.large}

            label="Loading Inventory..."

          />

          :

          <InventoryTable

            items={filteredItems}

            onEdit={onEdit}

            onDelete={onDelete}

          />

      }

      <InventoryForm

        isOpen={isDialogOpen}

        item={selectedItem}

        onSave={onSave}

        onCancel={onCancelDialog}

      />

    </Stack>

  );

};

export default Inventory;