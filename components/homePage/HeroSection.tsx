import Image from "next/image"
import Link from "next/link"

const HeroSection = () => {
  return (
    <div>
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">

            {/* Left */}
            <div className="absolute left-0 top-0 h-full">
            <Image
                src="/assets/images/frame2.png"
                alt=""
                width={400}
                height={1000}
                className="object-cover object-left opacity-100"
            />
            </div>

            {/* Right */}
            <div className="absolute right-0 top-0 h-full">
            <Image
                src="/assets/images/frame1.png"
                alt=""
                width={400}
                height={1000}
                className="object-cover object-right opacity-100"
            />
            </div>

            {/* 🔥 Gradient Overlay */}
            <div className="absolute inset-0 heroSectionBg z-0"></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-2xl px-2">
            <h2 className="scoundColor bgTitleColor mb-8 p-3 rounded-3xl font-normal">
                دفعة جديدة - التسجيل مفتوح الآن لعام 2026
            </h2>
            <h1 className="text-4xl font-bold mb-4">
                <span className="mainColor"> تعلّم بعلمٍ ... </span>
                <span className="scoundColor"> وتقدّم بيقين </span>
            </h1>
            <p className="descriptionColor font-bold mt-2">
            مسار دراسي متكامل يجمع بين التأصيل العلمي، الفهم المنهجي، والتطبيق العملي في الدراسات الإسلامية.
            </p>

            <div className="flex items-center justify-center gap-6 mt-8">
                <Link href=""
                className="scoundBgColor p-2 rounded-md text-white font-light">
                    التحق بالبرنامج الآن
                </Link>
                <Link href=""
                className="mainColor p-2 rounded-md font-medium border border-[#424C61]">
                    تعرف علي البرنامج
                </Link>
            </div>
            </div>

     </section>
    </div>
  )
}

export default HeroSection
