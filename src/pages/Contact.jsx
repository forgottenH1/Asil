import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, User, Tag, Info } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Contact = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = React.useState({ submitting: false, submitted: false, error: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ submitting: true, submitted: false, error: null });

    try {
      // تم استخدام المعرف الخاص بك: xwvaagwz
      const FORMSPREE_ID = "xwvaagwz";
      
      const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus({ submitting: false, submitted: true, error: null });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('فشل الإرسال');
      }
    } catch (err) {
      // في حالة وجود خطأ (أو إذا لم يتم تعيين المعرف بعد)، سنظهر رسالة توضيحية
      setStatus({ submitting: false, submitted: false, error: 'حدث خطأ أثناء الإرسال. يرجى المحاولة لاحقاً.' });
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Helmet>
        <title>تواصل معنا - منصة أصيل</title>
        <meta name="description" content="تواصل مع فريق منصة أصيل للاقتراحات أو الاستفسارات" />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-transparent pt-16 pb-24 text-center">
        <div className="container mx-auto px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-primary-dark mb-6"
          >
            تواصل معنا
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            نحن هنا للإجابة على استفساراتكم واقتراحاتكم لتطوير منصة أصيل. يسعدنا دائماً سماع رأيك.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Info Banner */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-primary/5 p-6 rounded-2xl border border-primary/10 mb-8 flex items-center justify-center gap-3 text-center"
          >
            <Info className="w-5 h-5 text-primary shrink-0" />
            <p className="text-gray-700 text-sm leading-relaxed">
              سيتم استقبال رسالتك ومعالجتها من قبل فريقنا وسنقوم بالرد عليك في أسرع وقت ممكن.
            </p>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-gray-200/50 border border-gray-100"
          >
            {status.submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">تم إرسال رسالتك بنجاح!</h2>
                <p className="text-gray-600 mb-8">شكراً لتواصلك معنا، سنرد عليك في أقرب وقت ممكن.</p>
                <button 
                  onClick={() => setStatus({ ...status, submitted: false })}
                  className="text-primary font-bold hover:underline"
                >
                  إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {status.error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
                    {status.error}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الاسم بالكامل</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="أدخل اسمك هنا"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-11 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                      <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                    <div className="relative">
                      <input 
                        type="email" 
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@gmail.com"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-11 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-left"
                        dir="ltr"
                      />
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الموضوع</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="ما هو موضوع رسالتك؟"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-11 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                    <Tag className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الرسالة</label>
                  <div className="relative">
                    <textarea 
                      name="message"
                      required
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="اكتب رسالتك بالتفصيل هنا..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-11 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    ></textarea>
                    <MessageSquare className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={status.submitting}
                  className={`w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-all ${status.submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <Send className="w-5 h-5" />
                  {status.submitting ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                </motion.button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
