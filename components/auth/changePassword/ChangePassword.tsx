"use client";

import { useState, type SubmitEventHandler } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import ProfileShell from "@/components/auth/profile/ProfileShell";
import { useChangePasswordMutation } from "@/store/auth/authApi";
import { extractApiErrorMessage } from "@/lib/studentProgram/programErrors";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";

const ChangePassword = () => {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const router = useRouter();
  const cp = translate?.pages?.changePassword;

  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!oldPassword || !password || !passwordConfirm) {
      toast.error(
        translate?.pages?.signUp?.fillAllFields ?? "Please fill all fields",
      );
      return;
    }
    if (password !== passwordConfirm) {
      toast.error(
        translate?.pages?.signUp?.passwordMismatch ?? "Passwords do not match",
      );
      return;
    }

    try {
      const res = await changePassword({
        old_password: oldPassword,
        password,
        password_confirmation: passwordConfirm,
      }).unwrap();
      toast.success(res?.message ?? cp?.title ?? "");
      router.push(`/${lang}/profile`);
    } catch (err) {
      toast.error(extractApiErrorMessage(err, cp?.title ?? ""));
    }
  };

  const fieldClass =
    "mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus-visible:ring-0 focus-visible:outline-none";

  return (
    <ProfileShell active="settings">
      <h2 className="mb-2 text-base font-bold mainColor md:text-lg">
        {cp?.title}
      </h2>
      <p className="mb-6 text-sm font-semibold descriptionColor">
        {cp?.subtitle}
      </p>

      <form onSubmit={handleSubmit} className="max-w-xl">
        {(
          [
            {
              id: "oldPassword",
              label: cp?.oldPassword,
              value: oldPassword,
              set: setOldPassword,
              show: showOld,
              toggle: () => setShowOld((v) => !v),
            },
            {
              id: "password",
              label: cp?.password,
              value: password,
              set: setPassword,
              show: showNew,
              toggle: () => setShowNew((v) => !v),
            },
            {
              id: "passwordConfirm",
              label: cp?.confirmPassword,
              value: passwordConfirm,
              set: setPasswordConfirm,
              show: showConfirm,
              toggle: () => setShowConfirm((v) => !v),
            },
          ] as const
        ).map((field) => (
          <div key={field.id} className="mb-4">
            <label
              htmlFor={field.id}
              className="text-xs font-semibold descriptionColor"
            >
              {field.label}
            </label>
            <div className="relative">
              <input
                id={field.id}
                type={field.show ? "text" : "password"}
                value={field.value}
                onChange={(e) => field.set(e.target.value)}
                className={fieldClass}
                autoComplete={
                  field.id === "oldPassword"
                    ? "current-password"
                    : "new-password"
                }
              />
              <button
                type="button"
                onClick={field.toggle}
                className="absolute top-1/2 inset-e-3 -translate-y-1/2 descriptionColor"
                aria-label={field.label}
              >
                {field.show ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        ))}

        <p className="mb-6 text-xs leading-relaxed text-red-500">
          {cp?.passCondition}
        </p>

        <div className="flex flex-wrap items-center justify-end gap-3">
          <Link
            href={`/${lang}/profile`}
            className="rounded-lg px-4 py-2 text-sm font-semibold descriptionColor hover:bg-gray-50"
          >
            {cp?.cancelBtn}
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="scoundBgColor rounded-lg px-5 py-2 text-sm font-semibold text-white disabled:opacity-70"
          >
            {isLoading ? cp?.processing : cp?.confirmBtn}
          </button>
        </div>
      </form>
    </ProfileShell>
  );
};

export default ChangePassword;
