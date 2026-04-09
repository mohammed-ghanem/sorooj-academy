import Image from "next/image"
import aboutImage from "@/public/assets/images/aboutsection.png"


const AboutSection = () => {
  return (
    <section className="px-2 md:px-4 py-10 mt-1 md:mt-10">
     <div>
        <h2 className="container mx-auto text-2xl font-bold text-center">
            <span className="mainColor">لماذا وُجدت </span>
            <span className="scoundColor"> أكاديمية سُرج؟</span>
        </h2>
        <p className="container w-full md:w-[60%] mx-auto text-center text-md font-bold mt-8 descriptionColor">
        في زمن تتسارع فيه المعلومات وتختلط فيه المفاهيم، جاءت أكاديمية سُروج لتقدم مسارًا علميًا واضحًا قائمًا على التأصيل والفهم المنهجي.
        <br />
        نؤمن أن طلب العلم ليس محتوى يُستهلك، بل رحلة تُبنى على مراحل، خطوة بعد خطوة، حتى يترسخ الفهم ويثبت اليقين.
        <br />
        أكاديمية سُرج ليست مجرد منصة تعليمية، بل بيئة علمية تجمع بين التعلم المنهجي والتأثير الحقيقي , فنحن نفخر بمجتمع متنامٍ من طلاب العلم الذين يسيرون معنا في رحلة معرفية منظمة ومؤثرة.
        </p>

        <div className="relative container mx-auto mt-10 w-auto md:w-[1000px] h-auto md:h-[430px] p-0 overflow-hidden rounded-4xl">
        <div className="absolute inset-0 z-10 bg-[#f7f5f2]/10 rounded-4xl"></div>
        <Image src={aboutImage} alt="about" width={1000} height={430} 
        className="relative z-0 mx-auto max-h-[430px] object-cover"/>
        </div>
     </div>
    </section>
  )
}

export default AboutSection