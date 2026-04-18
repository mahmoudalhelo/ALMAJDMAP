export const DeleteAccountPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans" dir="rtl">
      <div className="bg-white max-w-2xl w-full rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-jordan-black p-8 text-center text-white">
          <img 
            src="https://almajdmap.rojnda.com/almjd.png" 
            className="w-20 h-20 rounded-2xl mx-auto mb-4 shadow-lg border-2 border-jordan-red" 
            alt="Logo" 
          />
          <h1 className="text-2xl font-bold">طلب حذف الحساب والبيانات</h1>
          <p className="text-gray-400 mt-2">خارطة المجد - تطبيق استكشاف تاريخ الأردن</p>
        </div>

        <div className="p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-jordan-red mb-4">كيفية حذف حسابك</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              نحن نحترم خصوصيتك ونمنحك التحكم الكامل في بياناتك. يمكنك طلب حذف حسابك باتباع الخطوات التالية:
            </p>
            <div className="bg-gray-50 p-6 rounded-2xl space-y-4 border border-gray-100">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-jordan-red text-white rounded-full flex items-center justify-center shrink-0 font-bold">1</div>
                <p className="text-gray-700">افتح تطبيق <b>خارطة المجد</b> على هاتفك أو عبر المتصفح.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-jordan-red text-white rounded-full flex items-center justify-center shrink-0 font-bold">2</div>
                <p className="text-gray-700">قم بتسجيل الدخول إلى حسابك الذي ترغب في حذفه.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-jordan-red text-white rounded-full flex items-center justify-center shrink-0 font-bold">3</div>
                <p className="text-gray-700">اضغط على <b>صورتك الشخصية</b> في الزاوية العلوية لفتح الملف الشخصي.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-jordan-red text-white rounded-full flex items-center justify-center shrink-0 font-bold">4</div>
                <p className="text-gray-700">انزل إلى أسفل القائمة واضغط على خيار <b>"حذف الحساب والبيانات"</b>.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-jordan-red text-white rounded-full flex items-center justify-center shrink-0 font-bold">5</div>
                <p className="text-gray-700">قم بتأكيد الحذف في الرسالة التي ستظهر لك.</p>
              </div>
            </div>
          </section>

          <section className="border-t border-gray-100 pt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">ما هي البيانات التي يتم حذفها؟</h2>
            <p className="text-gray-600 mb-4">بمجرد تأكيد طلب الحذف، سيقوم النظام بالعمليات التالية:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mr-4">
              <li>حذف ملفك الشخصي بالكامل (الاسم، البريد الإلكتروني، الصورة).</li>
              <li>مسح جميع نقاط المجد التي قمت بجمعها.</li>
              <li>حذف سجل المواقع التي قمت بزيارتها والتحديات التي حللتها.</li>
              <li>إزالة اسمك من قائمة المتصدرين (Leaderboard).</li>
            </ul>
            <p className="mt-4 text-sm text-red-500 font-bold italic">
              * ملاحظة: عملية الحذف نهائية وفورية ولا يمكن استعادة البيانات بعد إتمامها.
            </p>
          </section>

          <section className="border-t border-gray-100 pt-8 pb-4">
            <h2 className="text-lg font-bold text-gray-800 mb-2">هل تحتاج لمساعدة إضافية؟</h2>
            <p className="text-gray-600 text-sm">
              إذا واجهت أي مشكلة في عملية الحذف، يمكنك التواصل معنا عبر البريد الإلكتروني: 
              <a href="mailto:mhmoudalhelo@gmail.com" className="text-jordan-red font-bold mr-1">mhmoudalhelo@gmail.com</a>
            </p>
          </section>
        </div>
        
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} خارطة المجد - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </div>
  );
};
