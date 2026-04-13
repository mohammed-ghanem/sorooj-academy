import Image from "next/image"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

type HeroAuthProps = {
  children?: ReactNode;
  contentClassName?: string;
};

const HeroAuth = ({ children, contentClassName }: HeroAuthProps) => {
  return (
    <div className="relative">
      <section className="relative h-auto  w-full flex items-center justify-center overflow-hidden">

            {/* Left */}
            <div className="absolute left-0 top-0   w-[40vw]  h-screen!">
            <Image
                src="/assets/images/frame2.png"
                alt=""
                fill
                className="object-cover object-left opacity-100"
                
            />
            </div>

            {/* Right */}
            <div className="absolute right-0 top-0  w-[40vw] h-screen!">
            <Image
                src="/assets/images/frame1.png"
                alt=""
                fill
                className="object-cover object-right opacity-100 "
            />
            </div>

            {/* 🔥 Gradient Overlay */}
            <div className="absolute inset-0 heroSectionBg z-1 pointer-events-none"></div>

            {/* Content */}
                <div
                  className={cn(
                    "relative z-10 flex flex-col items-center mt-3 justify-center text-center max-w-2xl w-full px-2",
                    contentClassName
                  )}
                >
                  {children}
                </div>
           
     </section>
    </div>
  )
}

export default HeroAuth
