"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Camera, Loader2 } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import { toast } from "sonner";
import ProfileShell from "@/components/auth/profile/ProfileShell";
import {
  asProfileText,
  profileCountryId,
  unwrapProfileUser,
} from "@/components/auth/profile/profileUser";
import {
  useGetCountriesQuery,
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/store/auth/authApi";
import { extractApiErrorMessage } from "@/lib/studentProgram/programErrors";
import LangUseParams from "@/translate/LangUseParams";
import TranslateHook from "@/translate/TranslateHook";
import "react-phone-input-2/lib/style.css";
import "./style.css";

function UpdateProfile() {
  const lang = LangUseParams();
  const translate = TranslateHook();
  const router = useRouter();
  const up = translate?.pages?.updateProfile;
  const p = translate?.pages?.profile;
  const tSignUp = translate?.pages?.signUp;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profileData, refetch } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: countries = [] } = useGetCountriesQuery({ page: 0, limit: 0 });
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const user = unwrapProfileUser(profileData);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [countryId, setCountryId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (!user) return;
    setName(asProfileText(user.name));
    setEmail(asProfileText(user.email));
    setMobile(asProfileText(user.mobile).replace(/^\+/, ""));
    setBirthDate(asProfileText(user.date_of_birth));
    const g = asProfileText(user.gender);
    setGender(g === "female" ? "female" : g === "male" ? "male" : "");
    setCountryId(profileCountryId(user.country));
    setImagePreview(asProfileText(user.avatar) || asProfileText(user.image));
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error(up?.imageTooLarge ?? "Image size should be less than 2MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error(up?.invalidImageType ?? "Please select a valid image file");
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error(up?.nameRequired ?? tSignUp?.fillAllFields ?? "");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("email", email.trim());
    formData.append("mobile", mobile ? `+${mobile.replace(/^\+/, "")}` : "");
    if (birthDate) formData.append("date_of_birth", birthDate);
    if (gender) formData.append("gender", gender);
    if (countryId) formData.append("country_id", countryId);
    if (selectedFile) formData.append("avatar", selectedFile);

    try {
      const res = await updateProfile(formData).unwrap();
      toast.success(res?.message ?? up?.confirmBtn ?? "");
      await refetch();
      router.push(`/${lang}/profile`);
    } catch (err) {
      toast.error(extractApiErrorMessage(err, up?.title ?? ""));
    }
  };

  const fieldClass =
    "mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus-visible:ring-0 focus-visible:outline-none";

  return (
    <ProfileShell active="personal">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold mainColor md:text-lg">
          {up?.titleUpdate ?? p?.personalDetails}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-5">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bkMainColor text-xl font-bold text-white"
          >
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreview}
                alt=""
                className="h-20 w-20 object-cover"
              />
            ) : (
              <span>{name.slice(0, 1) || "—"}</span>
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity hover:opacity-100">
              <Camera className="h-5 w-5 text-white" />
            </span>
          </button>
          <p className="text-xs descriptionColor">{up?.titleUpdate}</p>
        </div>

        <div>
          <label htmlFor="name" className="text-xs font-semibold descriptionColor">
            {p?.name ?? up?.name}
          </label>
          <input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="text-xs font-semibold descriptionColor">
            {p?.email ?? up?.email}
          </label>
          <input
            id="email"
            name="email"
            value={email}
            readOnly
            disabled
            className={`${fieldClass} bg-gray-50`}
          />
        </div>

        <div>
          <label htmlFor="birthDate" className="text-xs font-semibold descriptionColor">
            {p?.dateOfBirth}
          </label>
          <input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="country" className="text-xs font-semibold descriptionColor">
            {p?.country}
          </label>
          <select
            id="country"
            value={countryId}
            onChange={(e) => setCountryId(e.target.value)}
            className={fieldClass}
          >
            <option value="">{p?.emptyValue ?? "—"}</option>
            {countries.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold descriptionColor">{p?.gender}</p>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm font-semibold mainColor">
              <input
                type="radio"
                name="gender"
                checked={gender === "male"}
                onChange={() => setGender("male")}
              />
              {tSignUp?.male}
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold mainColor">
              <input
                type="radio"
                name="gender"
                checked={gender === "female"}
                onChange={() => setGender("female")}
              />
              {tSignUp?.female}
            </label>
          </div>
        </div>

        <div dir="ltr">
          <label className="text-xs font-semibold descriptionColor">
            {p?.phone ?? up?.phone}
          </label>
          <div className="mt-1">
            <PhoneInput
              country="kw"
              value={mobile}
              onChange={(value) => setMobile(value)}
              inputClass="!w-full !h-10"
              containerClass="!w-full"
            />
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-end gap-3">
          <Link
            href={`/${lang}/profile`}
            className="rounded-lg px-4 py-2 text-sm font-semibold descriptionColor hover:bg-gray-50"
          >
            {translate?.pages?.changePassword?.cancelBtn ?? "Cancel"}
          </Link>
          <button
            type="submit"
            disabled={isUpdating}
            className="scoundBgColor rounded-lg px-5 py-2 text-sm font-semibold text-white disabled:opacity-70"
          >
            {isUpdating ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {up?.processing}
              </span>
            ) : (
              up?.confirmBtn
            )}
          </button>
        </div>
      </form>
    </ProfileShell>
  );
}

export default UpdateProfile;
