import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
  icon: React.ReactNode;
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, title, content, icon }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-jordan-black/80 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  {icon}
                </div>
                <h2 className="text-xl font-bold text-jordan-black">{title}</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto text-right leading-relaxed text-gray-700 space-y-6" dir="rtl">
              {content}
            </div>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <button 
                onClick={onClose}
                className="w-full bg-jordan-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors"
              >
                إغلاق
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const PrivacyPolicy: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const content = (
    <>
      <section>
        <h3 className="text-lg font-bold text-jordan-red mb-2">1. جمع المعلومات</h3>
        <p>نحن نجمع المعلومات التي تقدمها لنا مباشرة عند إنشاء حساب، مثل اسم المستخدم واسم المدرسة. كما نستخدم خدمات Google Auth لتسهيل عملية الدخول.</p>
      </section>
      <section>
        <h3 className="text-lg font-bold text-jordan-red mb-2">2. استخدام البيانات</h3>
        <p>نستخدم بياناتك فقط لتحسين تجربة اللعب، وعرض اسمك في قائمة المتصدرين، وتتبع تقدمك في التحديات التاريخية.</p>
      </section>
      <section>
        <h3 className="text-lg font-bold text-jordan-red mb-2">3. الموقع الجغرافي</h3>
        <p>يتطلب التطبيق الوصول إلى موقعك الجغرافي لتحديد قربك من المواقع التاريخية وتفعيل التحديات. لا نقوم بتخزين سجل تحركاتك، بل نستخدم الموقع اللحظي فقط.</p>
      </section>
      <section>
        <h3 className="text-lg font-bold text-jordan-red mb-2">4. حماية البيانات</h3>
        <p>نحن نستخدم تقنيات Firebase المتقدمة لضمان أمن بياناتك. يمكنك حذف حسابك وبياناتك بالكامل في أي وقت من خلال إعدادات الملف الشخصي.</p>
      </section>
      <section>
        <h3 className="text-lg font-bold text-jordan-red mb-2">5. التواصل</h3>
        <p>إذا كان لديك أي استفسار حول سياسة الخصوصية، يمكنك التواصل معنا عبر البريد الإلكتروني الموضح في التطبيق.</p>
      </section>
    </>
  );

  return (
    <LegalModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="سياسة الخصوصية" 
      icon={<ShieldCheck className="w-6 h-6 text-jordan-green" />} 
      content={content} 
    />
  );
};

export const TermsOfService: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const content = (
    <>
      <section>
        <h3 className="text-lg font-bold text-jordan-red mb-2">1. قبول الشروط</h3>
        <p>باستخدامك لتطبيق "خارطة المجد"، فإنك توافق على الالتزام بهذه الشروط والقوانين المعمول بها في المملكة الأردنية الهاشمية.</p>
      </section>
      <section>
        <h3 className="text-lg font-bold text-jordan-red mb-2">2. الاستخدام المقبول</h3>
        <p>يجب استخدام التطبيق لأغراض تعليمية وتثقيفية فقط. يمنع أي محاولة للتلاعب بالنقاط أو اختراق النظام أو انتحال شخصيات أخرى.</p>
      </section>
      <section>
        <h3 className="text-lg font-bold text-jordan-red mb-2">3. الملكية الفكرية</h3>
        <p>جميع المحتويات، بما في ذلك النصوص والرسومات والشعارات، هي ملك لمطور التطبيق ، ولا يجوز إعادة استخدامها دون إذن.</p>
      </section>
      <section>
        <h3 className="text-lg font-bold text-jordan-red mb-2">4. إخلاء المسؤولية</h3>
        <p>نحن نسعى لتقديم معلومات تاريخية دقيقة، ولكننا غير مسؤولين عن أي أخطاء غير مقصودة. كما يجب على المستخدمين توخي الحذر عند التحرك في الواقع للوصول للمواقع.</p>
      </section>
      <section>
        <h3 className="text-lg font-bold text-jordan-red mb-2">5. التعديلات</h3>
        <p>نحتفظ بالحق في تعديل هذه الشروط في أي وقت. استمرارك في استخدام التطبيق يعني قبولك للتعديلات الجديدة.</p>
      </section>
    </>
  );

  return (
    <LegalModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="شروط الخدمة" 
      icon={<FileText className="w-6 h-6 text-jordan-red" />} 
      content={content} 
    />
  );
};
