import Image from "next/image"
import studyMethod from "@/public/assets/images/holyQ.jpg"

const studyMethods = [
    {
      id: 1,
      title: "مشروع التخرج البحثي",
      desc: "يُختتم المسار العلمي بمشروع تخرج يقوم فيه المشارك بإعداد بحث علمي محكّم في أحد الموضوعات التي تطرحها الأكاديمية، بإشراف علمي يهدف إلى تنمية مهارات البحث، والتحليل، والاستدلال المنهجي.",
      icon: "/assets/images/frame30.svg",
    },
    {
      id: 2,
      title: "المواد العلمية التفاعلية",
      desc: "تُقدَّم المواد العلمية بأسلوب منهجي يجمع بين الشرح المرئي والمسموع والمحتوى المكتوب، وفق مقررات معتمدة وخطة واضحة. كما تتضمن محاضرات تفاعلية تعزز الفهم، وتدعم التحصيل العلمي بما يناسب مستويات المشاركين المختلفة.",
      icon: "/assets/images/frame31.svg",
    },
    {
      id: 3,
      title: "الخطة الدراسية المتدرجة",
      desc: "تعتمد الأكاديمية خطة علمية منظمة تتكون من فصول تكاملية مترابطة، يدرس فيها المشارك عددًا من المحاور الأساسية وفق تدرج مدروس. ويمتد كل فصل لمدة محددة تتخلله اختبارات دورية لقياس الفهم والتقدم، قبل الانتقال إلى المرحلة التالية.",
      icon: "/assets/images/frame32.svg",
    }
    
  ];

const StudyMethod = () => {
  return (
    <section className="py-0 sm:py-16 lg:py-20 px-4 container mx-auto w-[90%]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center">
        <div className="w-full md:w-[85%]">
          <h2 className="text-xl sm:text-2xl font-bold mainColor leading-snug">
            <span className="mainColor">منهجية الدراسة </span>
            <span className="scoundColor"> وآليتها</span>
          </h2>
          <p className="descriptionColor font-bold mt-3 sm:mt-4 max-w-xl sm:max-w-2xl mx-auto text-sm sm:text-md leading-relaxed">
          نظام تعليمي متدرج يجمع بين التأصيل العلمي، التطبيق العملي، والتقييم المستمر لضمان بناء معرفة راسخة.
          </p>
          <div className="relative container mx-auto mt-6 w-full h-80 p-0 
            overflow-hidden rounded-2xl">
            <div className="absolute inset-0 z-10 bg-[#f7f5f2]/10 rounded-2xl"></div>
                 <Image src={studyMethod} alt="studyMethod" fill
                    className="relative z-0 mx-auto max-h-107.5 object-cover"/>
            </div>
        </div>
        <div className="">
            {studyMethods.map((stat) => (
                <div key={stat.id} 
                className="lightBgColor mt-2.5 md:mt-0 rounded-md mb-2.5 flex items-start p-4">
                {/* Icon */}
                
                    <div className="lightBgColor p-4 rounded-md ml-4 studyMethod-frame-icon">
                        <Image width={60} height={60} src={stat.icon} alt={stat.title} />
                    </div>
    
                    <div className="text-start">
                        {/* Value */}
                        <h3 className="text-md mb-2 font-bold mainColor">{stat.title}</h3>
        
                        {/* Title */}
                        <p className="text-sm mt-1 descriptionColor font-bold">{stat.desc}</p>
                    </div>

                </div>
            ))}
        </div>

      </div>
    </section>
  )
}

export default StudyMethod
