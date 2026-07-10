import * as React from "react";
import Inventory from "./Inventory/Inventory";
import { IInventoryManagementProps } from "./IInventoryManagementProps";

const InventoryManagement: React.FC<IInventoryManagementProps> = (props) => {

    return <Inventory {...props} />;

};

export default InventoryManagement;