import Image from "next/image";
import balance from "@/public/assets/images/balance.svg";
import openbook from "@/public/assets/images/openbook.svg";
import light from "@/public/assets/images/light.svg";
import search from "@/public/assets/images/search.svg";
import hand from "@/public/assets/images/hand.svg";
import ques from "@/public/assets/images/ques.svg";
import "./styles.css";

const features = [
  {
    id: 1,
    image: "/assets/images/test.png",
    title: "التأصيل الشرعي",
    desc: "ترسيخ التأصيل الشرعي الصحيح لقضايا العقيدة والإيمان، وبناؤها على أصول راسخة مستمدة من الكتاب والسنة وفهم السلف الصالح.",
    icon: balance,
  },
  {
    id: 2,
    image: "/assets/images/test2.jpg",
    title: "الأسس العلمية للنصوص",
    desc: "إبراز القواعد العلمية والمنهجية المنضبطة في التعامل مع النصوص الشرعية، وفق الأصول السلفية القائمة على الفهم الصحيح والاستدلال المتزن.",
    icon: openbook,
  },
  {
    id: 3,
    image: "/assets/images/test.png",
    title: "ضبط نظرية المعرفة",
    desc: "ضبط نظرية المعرفة ومصادرها الصحيحة وتمييز المغالطات فيها وإبطالها.",
    icon: light,
  },
  {
    id: 4,
    image: "/assets/images/test2.jpg",
    title: "تحصين المجتمعات",
    desc: "تحصين المجتمعات من آفات الأفكار الهدامة بالعلم والبينة والبرهان.",
    icon: search,
  },
  {
    id: 5,
    image: "/assets/images/test.png",
    title: "المنهجية الشرعية",
    desc: "توضيح المنهج الشرعي القويم في التعامل مع الشبهات والانحرافات الفكرية، والرد عليها وفق ضوابط علمية وأصول منهجية راسخة.",
    icon: hand,
  },
  {
    id: 6,
    image: "/assets/images/test2.jpg",
    title: "كشف أصول الشبهات",
    desc: "تحليل جذور الشبهات والانحرافات الكبرى قديمًا وحديثًا، وتسليط الضوء على أبرز تطبيقاتها المعاصرة وسبل معالجتها علميًا.",
    icon: ques,
  },
];

const OurGoals = () => {
  return (
    <section className="py-14 sm:py-16 lg:py-18 px-2 bg-white container mx-auto w-[90%]">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mainColor leading-snug">
            <span className="mainColor">أهدافنا نحو بناء </span>
            <span className="scoundColor">جيلٍ واعٍ بالعلم </span>
          </h2>

          <p className="descriptionColor font-bold mt-3 sm:mt-4  mx-auto text-sm sm:text-base leading-relaxed">
            نعمل على بناء تجربة تعليمية متكاملة تدعم طالب العلم في رحلته نحو
            الفهم والتأصيل عبر منهج واضح ومتدرج.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((item) => (
            <div
              key={item.id}
              className="bg-white
              shadow-sm hover:shadow-md transition duration-300 text-center sm:text-right relative
               rounded-xl sm:rounded-2xl mb-6"
            >
              <div className=" w-full h-80 relative rounded-xl sm:rounded-2xl overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Icon */}
              <div
                className="absolute bg-white rounded-xl sm:rounded-2xl w-[90%]
               m-auto -bottom-10 left-0 right-0 p-4 sm:p-5 lg:p-6 shadow h-auto sm:h-40 lg:h-45"
              >
                <div className="scoundBgColor absolute top-0 right-4 w-12 h-12 rounded-b-full flex items-center justify-center shadow-md">
                  <Image src={item.icon} alt={item.title} width={30} height={30} className="w-[30px] h-[30px]" />
                </div>
                <div className="mt-8">
                  <h3 className="font-bold text-xl mb-1 sm:mb-2 mainColor ">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm descriptionColor leading-relaxed font-bold">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurGoals;
