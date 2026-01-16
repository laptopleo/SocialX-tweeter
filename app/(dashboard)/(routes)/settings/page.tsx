import BillingSettings from "@/components/settings/billing-settings";
import DarkModetoggle from "@/components/settings/dark-mode";
import { Fragment } from "react";
import Header from "../../_components/_common/Header";

const Settings = () => {
  return (
    <Fragment>
      <Header label="Settings" showBackArrow />
      <BillingSettings />
      <DarkModetoggle />
    </Fragment>
  );
};

export default Settings;
