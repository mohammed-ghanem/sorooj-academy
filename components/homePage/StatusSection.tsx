import Image from "next/image";
import people from "@/public/assets/images/people.png";
import ayah from "@/public/assets/images/ayah.png";
import readbook from "@/public/assets/images/readbook.png";
import global from "@/public/assets/images/global.png";



const stats = [
    {
      id: 1,
      title: "طالب مسجل",
      value: "5000 +",
      icon: people,
    },
    {
      id: 2,
      title: " مادة علمية متخصصة",
      value: "120 +",
      icon: ayah,
    },
    {
      id: 3,
      title: " عضو هيئة التدريس",
      value: "30 +",
      icon: readbook,
    },
    {
      id: 4,
      title: "دولة مشاركة",
      value: "8 +",
      icon: global,
    },
  ];
  
  const StatusSection = () => {
    return (
      <section className="relative z-11 p-4 -mt-19">
        <div className="max-w-6xl mx-auto rounded-2xl
         shadow-lg py-8 ps-4 md:px-1 block md:grid grid-cols-2 md:grid-cols-4 gap-6 
         text-center bgTitleColorOpacity2">
          {stats.map((stat) => (
            <div key={stat.id} 
            className="flex items-center justify-start md:justify-center border-l-none
             md:border-l last:border-none border-[#9f854e7a] mt-2.5 md:mt-0">
              {/* Icon */}
                <div className="  bg-[#f5f3ed] p-3 rounded-md ml-4">
                    <Image width={30} height={30} src={stat.icon} alt={stat.title} />
                </div>
  
                <div className="text-start">
                    {/* Value */}
                    <h3 className="text-2xl font-bold mainColor">{stat.value}</h3>
    
                    {/* Title */}
                    <p className="text-sm mt-1 descriptionColor font-bold">{stat.title}</p>
                </div>

            </div>
          ))}
        </div>
      </section>
    );
  };
  
  export default StatusSection;