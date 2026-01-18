import React from "react";
import SocialLogin from "./_components/SocialLogin";

import LoginForm from "./_components/LoginForm";
import RegisterFormModal from "./_components/RegisterFormModal";

const Page = () => {
  return (
    <div className="flex h-auto flex-col items-center lg:h-full">
      <main className="h-full w-full">
        <div className="flex h-full w-full flex-col-reverse items-center lg:flex-row-reverse">
          <div className="flex h-full flex-1 flex-shrink flex-col p-4 lg:min-w-[437px] lg:max-w-[760px]">
            <div className="mb-6 mt-4">
              <h1 className="text-[68px] font-black leading-[84px]">Happing now</h1>
            </div>
            <div className="mb-8">
              <h5 className="text-[31px] font-extrabold leading-9">Sign in to X</h5>
            </div>
            <div className="w-[300px]">
              <div className="sign_with_google mb-2">
                {/* { SocialLogin} */}
                <SocialLogin />
              </div>

              {/* { OR divider} */}
              <div className="-mx-1 my-1 flex w-[300px] max-w-[380px] flex-row items-center">
                <div className="h-[1px] flex-1 bg-muted dark:bg-[rgb(47,51,54)]" />
                <div className="mx-1 basis-0 pb-[5px] text-[15px] leading-5">or</div>
                <div className="h-[1px] flex-1 bg-muted dark:bg-[rgb(47,51,54)]" />
              </div>

              <div className="sign_with_email py-[12px]">
                <LoginForm />
              </div>

              <div className="mt-10">
                <h5>Dont have an account</h5>
                <RegisterFormModal />
              </div>
            </div>
          </div>

          {/* {Logo } */}
          <div className="lg:min-[45vh] flex flex-[1.2] items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="mx-auto !h-1/2 !w-1/2 fill-current">
              <g>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </g>
            </svg>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
