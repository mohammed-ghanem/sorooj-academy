import Image from "next/image";
import "./styles.css";


const features = [
  {
    id: 1,
    title: "تيسير العلوم الشرعية",
    desc: "نُقرّب العلوم الشرعية ونبسطها بأساليب حديثة، مستفيدين من التقنيات المعاصرة والمنصات الرقمية لتقديم المعرفة بطريقة سهلة وعميقة في آنٍ واحد.",
    icon: "/assets/images/frame5.svg",
  },
  {
    id: 2,
    title: "منهجية علمية متدرجة",
    desc: "خطة تعليمية محكمة تراعي التدرج والترقي العلمي، بما يساعد المشاركين على الثبات في التعلم وتحقيق نتائج ملموسة مع مرور الوقت.",
    icon: "/assets/images/frame6.svg",
  },
  {
    id: 3,
    title: "بيئة علمية موثوقة",
    desc: "بيئة معرفية نقية تجمع المشاركين بأهل العلم الموثوقين، وتعزز الارتباط المباشر بالمصادر الصحيحة والتوجيه الرشيد.",
    icon: "/assets/images/frame7.svg",
  },
  {
    id: 4,
    title: "شهادات معتمدة",
    desc: "تقديم شهادات مشاركة واجتياز معتمدة من مركز سرج، توثّق المسيرة العلمية وتمنح المشارك دافعًا للاستمرار والتطور.",
    icon: "/assets/images/frame8.svg",
  },
  {
    id: 5,
    title: "متابعة وتقييم مستمر",
    desc: "خطة تعليمية محكمة تراعي التدرج والترقي العلمي، بما يساعد المشاركين على الثبات في التعلم وتحقيق نتائج ملموسة مع مرور الوقت.",
    icon: "/assets/images/frame9.svg",
  },
  {
    id: 6,
    title: "رعاية المتميزين",
    desc: "إبراز الطاقات المتميزة وتفعيل دورها داخل المنصات العلمية، والاستفادة من قدراتهم في نشر العلم وخدمة المجتمع بطرق متعددة.",
    icon: "/assets/images/frame10.svg",
  },
  
];

const WhySection = () => {
  return (
    <section className="py-14 sm:py-16 lg:py-20 px-4 bgTitleColor m-3 md:m-0 decor-bg">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-2xl font-bold mainColor leading-snug">
            <span className="mainColor">ما الذي يجعل هذه</span>
            <span className="scoundColor"> التجربة استثنائية؟</span>
          </h2>

          <p className="descriptionColor font-bold mt-3 sm:mt-4 max-w-xl sm:max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            رحلة علمية متكاملة صُممت بعناية لتيسير طلب العلم، وبناء المعرفة،
            وصناعة أثر علمي راسخ يمتد نفعه إلى الفرد والمجتمع.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 
              shadow-sm hover:shadow-md transition duration-300 text-center sm:text-right"
            >
              {/* Icon */}
              <div className="flex justify-center sm:justify-start mb-3 sm:mb-4">
                <div className=" p-3.25! sm:p-3 rounded-lg home-page-bg mb-2">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={30}
                    height={30}
                    className="w-7.5 h-7.5"
                  />
                </div>
              </div>

              {/* Title */}
              <h3 className="font-bold text-xl mb-1 sm:mb-2 mainColor ">
                {item.title}
              </h3>

              {/* Desc */}
              <p className="text-xs sm:text-sm descriptionColor leading-relaxed font-bold">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySection;
