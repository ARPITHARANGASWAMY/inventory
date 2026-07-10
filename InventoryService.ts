import { SPFI } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

import { LISTS } from "../utils/Constants";
import { IInventory } from "../models/IInventory";

export default class InventoryService {

  constructor(private sp: SPFI) { }

  /**
   * Get all inventory items
   */
  public async getItems(): Promise<IInventory[]> {

    try {

      const items = await this.sp.web.lists
        .getByTitle(LISTS.INVENTORY)
        .items.select(
          "Id",
          "Title",
          "field_4",
          "field_5",
          "field_6",
          "field_7",
          "field_10",
          "CategoryId",
          "Item_x0020_TypeId"
        )();

      console.log("Sample item fields:", items.length > 0 ? Object.keys(items[0]) : "No items");

      // Map CategoryId to Category and Item_x0020_TypeId to Item_x0020_Type
      const mappedItems = items.map((item: Record<string, unknown>) => ({
        ...item,
        Category: (item as Record<string, unknown>).CategoryId || (item as Record<string, unknown>).Category,
        Item_x0020_Type: (item as Record<string, unknown>).Item_x0020_TypeId || (item as Record<string, unknown>).Item_x0020_Type,
        Description: (item as Record<string, unknown>).Description || ""
      }));

      return mappedItems as IInventory[];

    } catch (error) {

      console.error("Error loading inventory items", error);
      throw error;

    }
  }

  /**
   * Get inventory item by Id
   */
  public async getItemById(id: number): Promise<IInventory> {

    try {

      const item = await this.sp.web.lists
        .getByTitle(LISTS.INVENTORY)
        .items
        .getById(id)
        .select(
          "Id",
          "Title",
          "field_4",
          "field_5",
          "field_6",
          "field_7",
          "field_10",
          "CategoryId",
          "Item_x0020_TypeId"
        )();

      // Map CategoryId to Category and Item_x0020_TypeId to Item_x0020_Type
      return {
        ...item,
        Category: (item as Record<string, unknown>).CategoryId || (item as Record<string, unknown>).Category,
        Item_x0020_Type: (item as Record<string, unknown>).Item_x0020_TypeId || (item as Record<string, unknown>).Item_x0020_Type,
        Description: (item as Record<string, unknown>).Description || ""
      } as IInventory;

    } catch (error) {

      console.error("Error loading inventory item", error);
      throw error;

    }

  }

  /**
   * Create inventory item
   */
  public async createItem(item: IInventory): Promise<void> {

    try {

      const dataToAdd: Record<string, unknown> = {
        Title: item.Title,
        field_4: item.field_4,
        field_5: item.field_5,
        field_6: item.field_6,
        field_7: item.field_7,
        field_10: item.field_10
      };

      console.log("Creating item with data:", dataToAdd);

      await this.sp.web.lists
        .getByTitle(LISTS.INVENTORY)
        .items
        .add(dataToAdd);

    } catch (error) {

      console.error("Error creating inventory item", error);
      throw error;

    }

  }

  /**
   * Update inventory item
   */
  public async updateItem(item: IInventory): Promise<void> {

    try {

      if (!item.Id) {
        throw new Error("Item Id is required.");
      }

      const dataToUpdate: Record<string, unknown> = {
        Title: item.Title,
        field_4: item.field_4,
        field_5: item.field_5,
        field_6: item.field_6,
        field_7: item.field_7,
        field_10: item.field_10
      };

      console.log("Updating item with data:", dataToUpdate);

      await this.sp.web.lists
        .getByTitle(LISTS.INVENTORY)
        .items
        .getById(item.Id)
        .update(dataToUpdate);

    } catch (error) {

      console.error("Error updating inventory item", error);
      throw error;

    }

  }

  /**
   * Delete inventory item
   */
  public async deleteItem(id: number): Promise<void> {

    try {

      await this.sp.web.lists
        .getByTitle(LISTS.INVENTORY)
        .items
        .getById(id)
        .delete();

    } catch (error) {

      console.error("Error deleting inventory item", error);
      throw error;

    }

  }

  /**
   * Search inventory
   */
  public async searchItems(searchText: string): Promise<IInventory[]> {

    try {

      const items = await this.sp.web.lists
        .getByTitle(LISTS.INVENTORY)
        .items();

      return items as IInventory[];

    } catch (error) {

      console.error("Error searching inventory", error);
      throw error;

    }

  }

  /**
   * Update only available quantity
   */
  public async updateQuantity(
    id: number,
    quantity: number
  ): Promise<void> {

    try {

      await this.sp.web.lists
        .getByTitle(LISTS.INVENTORY)
        .items
        .getById(id)
        .update({

          field_4: quantity

        });

    } catch (error) {

      console.error("Error updating quantity", error);
      throw error;

    }

  }

}