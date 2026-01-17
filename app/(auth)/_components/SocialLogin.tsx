import React from "react";
import { Button } from "@/components/ui/button";
import GoogleLogo from "@/public/assets/google-logo.svg";
import { doSocialLogin } from "@/app/actions/auth.action";

const SocialLogin = () => {
  return (
    <form action={doSocialLogin}>
      <Button
        variant="outline"
        type="submit"
        className="h-10 w-full gap-2 rounded-full p-1 text-base font-medium !text-[#3c4043] shadow-sm dark:bg-white"
        name="action"
        value="google"
      >
        <GoogleLogo />
        Sign in with Google
      </Button>
    </form>
  );
};

export default SocialLogin;
