import { SPFI, spfi } from "@pnp/sp";
import { SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";

let sp: SPFI;

import { WebPartContext } from "@microsoft/sp-webpart-base";

export const getSP = (context: WebPartContext): SPFI => {

    if (!sp) {

        sp = spfi().using(SPFx(context));

    }

    return sp;

};