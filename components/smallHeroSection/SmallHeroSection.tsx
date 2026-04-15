import Image from "next/image"

type SmallHeroSectionProps = {
  title?: React.ReactNode
}

const SmallHeroSection = ({ title }: SmallHeroSectionProps) => {
  return (
    <section className="relative h-[45vh] w-full flex items-center justify-center overflow-hidden">

      {/* Left */}
      <div className="absolute left-0 top-0 w-100 h-screen!">
        <Image
          src="/assets/images/frame2.png"
          alt=""
          fill
          className="object-cover object-left"
        />
      </div>

      {/* Right */}
      <div className="absolute right-0 top-0 w-100 h-screen!">
        <Image
          src="/assets/images/frame1.png"
          alt=""
          fill
          className="object-cover object-right"
        />
      </div>

      {/* Gradient */}
      <div className="absolute inset-0 heroSectionBg z-1 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center mt-3 justify-center text-center
       max-w-2xl px-2">
        {title}
      </div>

    </section>
  )
}

export default SmallHeroSection