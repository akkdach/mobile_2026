import React from "react";
import AppBar from "../../components/AppBar";
import BackGroundImage from "../../components/BackGroundImage";

const VisitSettingWorkOrderPage = () => {
    const renderSyncWorkOrder = () => {
        return [<AppBar title="SyncWorkOrder (visits only)"></AppBar>];
    };

    return <>{<BackGroundImage components={renderSyncWorkOrder()} />}</>;
}

export default VisitSettingWorkOrderPage;
