"use client";
import SmallHeroSection from "../smallHeroSection/SmallHeroSection"
import TranslateHook from "@/translate/TranslateHook";


const StudyTopics = () => {
    const translate = TranslateHook();
  return (
    <div>
         <SmallHeroSection title={<h1 className="text-2xl font-semibold mt-28 mb-4">
            <span className="mainColor">{translate?.pages?.studyTopics?.title}</span>
            <span className="scoundColor">{translate?.pages?.studyTopics?.titleSpan}</span>
          </h1>} />
    </div>
  )
}

export default StudyTopics