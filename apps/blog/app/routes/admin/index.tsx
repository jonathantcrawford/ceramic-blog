import { useOutletContext } from "remix";

import { useEffect, useState } from "react";


import type { SelfID } from "@self.id/web";
import type { ModelTypes } from "~ceramic/models/types";
import type { ModelTypesToAliases } from "@glazed/types";


export default function Index() {
    const {selfID}: {selfID: SelfID<ModelTypes> | undefined} = useOutletContext();

    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const syncProfileData = async () => {
            const basicProfileDefinitionID = await selfID?.client.dataModel.getDefinitionID("basicProfile");
            console.log({basicProfileDefinitionID})
            const doc = await selfID?.client.dataStore.getRecordDocument(
                basicProfileDefinitionID as string
            );
            doc?.subscribe((value: any) => setProfileData(value?.next?.content));
        }
        if (selfID) {
            syncProfileData();
        }
    },[selfID])

    return (
        <>
        <div>{JSON.stringify(profileData)}</div>
        </>
    )
}