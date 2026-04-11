import HeroSection from "./HeroSection"
import StatusSection from "./StatusSection"
import AboutSection from "./AboutSection"
import WhySection from "./WhySection"
import OurGoals from "./OurGoals"
import StudyMethod from "./StudyMethod"
import StudyTerms from "./StudyTerms"


const HomePage = () => {
  return (
    <div>
      <HeroSection />
      <StatusSection/>
      <AboutSection/>
      <WhySection/>
      <OurGoals/>
      <StudyMethod/>
      <StudyTerms/>
    </div>
  )
}

export default HomePage