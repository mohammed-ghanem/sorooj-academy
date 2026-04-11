import Image from "next/image"



const studyLevels = [
    {
      id: 1,
      level: "01",
      title: "المستوى الأول التأسيسى",
      desc: "أساسيات التأصيل العلمي",
      img: "/assets/images/term1.png",
    },
    {
      id: 2,
      level: "02",
      title: "المستوى الثاني التأهيلى",
      desc: "التعمق في العلوم وربط المفاهيم",
      img: "/assets/images/term2.png",
    },
    {
      id: 3,
      level: "03",
      title: "المستوى الثالث التخصصى",
      desc: "التطبيق العملي والتحليل",
      img: "/assets/images/term3.png",
    },
    {
      id: 4,
      level: "04",
      title: "المستوى الرابع متقدم",
      desc: "مشروع التخرج والتخصص",
      img: "/assets/images/term1.png",
    },
  ];
  const StudyTerms = () => {
    return (
      <section className="py-10 sm:py-16 lg:py-20 px-4  decor-bg">
        <div className="container mx-auto w-[90%]">
            {/* Title */}
            <div className="text-center m-auto mb-10">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mainColor">
                        <span className="mainColor">نظام </span>
                        <span className="scoundColor">الدراسة</span>
                    </h2>
            
                    <p className="descriptionColor font-bold mt-3 max-w-xl mx-auto text-sm sm:text-md">
                        أربعة محاور دراسية متدرجة
                    </p>
            </div>
            
                    {/* Cards */}
            <div className="relative">
                 <div className="absolute left-1/2 top-0 h-full w-px scoundBgColor -translate-x-1/2 hidden md:block"></div>
                 <div className="absolute left-1/2 top-0 h-full -translate-x-1/2 flex flex-col justify-between items-center">
                    <span className="w-4 h-4 scoundBgColor rounded-full"></span>
                    <span className="w-4 h-4 scoundBgColor rounded-full"></span>
                    <span className="w-4 h-4 scoundBgColor rounded-full"></span>
                    <span className="w-4 h-4 scoundBgColor rounded-full"></span>
                 </div>
                        {studyLevels.map((term, index) => (
                            <div
                            key={term.id}
                            className={`flex flex-col md:flex-row items-center mb-8 ${
                                index % 2 === 1 ? "md:flex-row-reverse" : ""
                            }`}
                            >
                            <div className="md:w-1/2 p-4 m-auto w-fit flex justify-center">
                                <div className="">
                                <h5 className="bgTitleColor rounded-full mb-2 w-fit px-2 py-1 scoundColor">
                                    {term.level}
                                </h5>
                                <h3 className="text-md font-bold scoundColor mb-2">{term.title}</h3>
                                <p className="text-sm mainColor font-bold">{term.desc}</p>
                                </div>
                            </div>

                            <div className="w-4 h-4 bg-mainColor rounded-full z-10"></div>

                            <div className="md:w-1/2">
                                <div className="relative w-40 h-25 rounded-md overflow-hidden m-auto">
                                <Image
                                    src={term.img}
                                    alt={term.title}
                                    fill
                                    className="object-cover"
                                />
                                </div>
                            </div>
                    </div>
                ))}
            </div>

        </div>
      </section>
    );
  };
  
  export default StudyTerms;
