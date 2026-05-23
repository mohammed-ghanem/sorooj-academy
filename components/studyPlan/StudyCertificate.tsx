import "./styles.css";
import certificateIcon from "@/public/assets/images/certificate.svg";
import certificateImage from "@/public/assets/images/cetificate.jpeg";
import Image from "next/image";

const StudyCertificate = () => {
  return (
    <section className="py-14 sm:py-16 lg:py-20 px-4 bgTitleColor m-3 md:m-0 decor-bg">
      <div className="container mx-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div>
            <Image
              src={certificateIcon}
              alt="certificate"
              width={100}
              height={100}
            />
          </div>
        </div>
        <h2 className="text-2xl font-bold mainColor text-center mt-10">
          <span className="mainColor">رحلة علمية متكاملة تنتهي </span>
          <span className="scoundColor"> بشهادة معتمدة</span>
        </h2>
        <p className="descriptionColor text-center mt-4 max-w-xl mx-auto text-base font-semibold">
          بعد إتمام جميع المراحل الدراسية بنجاح، ستحصل على شهادة أكاديمية معتمدة
          تؤهلك للمساهمة في نشر العلم الشرعي الصحيح
        </p>

        <div className=" mt-10 flex items-center justify-center">
          <Image
            src={certificateImage}
            alt="certificate"
            width={1000}
            height={1000}
          />
        </div>
      </div>
    </section>
  );
};

export default StudyCertificate;
