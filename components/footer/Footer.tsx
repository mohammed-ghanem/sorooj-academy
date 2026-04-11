import "./style.css";

const Footer = () => {
  return (
    <footer className="relative mt-10 text-white pt-32 pb-10 overflow-hidden footer-bg">
      

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center px-4">
        {/* Logo */}
        <h2 className="text-3xl font-bold mb-4">سُرُج</h2>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300 mb-6">
          <a href="#">الرئيسية</a>
          <a href="#">البرامج الدراسية</a>
          <a href="#">منهجية الدراسة</a>
          <a href="#">نظام الدراسة</a>
          <a href="#">التحاق بنا</a>
        </div>

        {/* Secondary Links */}
        <div className="flex justify-center gap-6 text-sm text-gray-400 mb-6">
          <a href="#">سياسة الخصوصية</a>
          <a href="#">الشروط والأحكام</a>
          <a href="#">الأسئلة الشائعة</a>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-500 mb-6"></div>

        {/* Social Icons */}
        <div className="flex justify-center gap-4">
          <span className="w-8 h-8 border rounded-full flex items-center justify-center">
            f
          </span>
          <span className="w-8 h-8 border rounded-full flex items-center justify-center">
            t
          </span>
          <span className="w-8 h-8 border rounded-full flex items-center justify-center">
            in
          </span>
          <span className="w-8 h-8 border rounded-full flex items-center justify-center">
            ▶
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
