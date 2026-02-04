import { Metadata } from 'next'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export const metadata: Metadata = {
  title: 'Sık Sorulan Sorular | Filenes Sports',
  description: 'Filenes Sports hakkında sık sorulan sorular ve cevapları.',
}

const faqs = [
  {
    category: 'Sipariş ve Teslimat',
    questions: [
      {
        question: 'Siparişimi nasıl takip edebilirim?',
        answer:
          'Siparişinizi takip etmek için "Hesabım" sayfasından sipariş geçmişinize bakabilir veya size gönderilen kargo takip numarası ile kargo firmasının web sitesinden takip edebilirsiniz.',
      },
      {
        question: 'Kargo ücreti ne kadar?',
        answer:
          '150 TL ve üzeri siparişlerde kargo ücretsizdir. 150 TL altı siparişlerde kargo ücreti 29.90 TL olarak uygulanmaktadır.',
      },
      {
        question: 'Siparişim ne kadar sürede elime ulaşır?',
        answer:
          'Siparişleriniz genellikle 1-3 iş günü içinde kargoya verilir. Kargo süresi bulunduğunuz lokasyona göre 1-5 iş günü arasında değişebilir.',
      },
      {
        question: 'Hangi kargo firmaları ile çalışıyorsunuz?',
        answer:
          'Yurtiçi Kargo, Aras Kargo ve MNG Kargo ile çalışmaktayız. Sipariş sırasında tercih edilen kargo firmasını seçebilirsiniz.',
      },
    ],
  },
  {
    category: 'Ödeme',
    questions: [
      {
        question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
        answer:
          'Kredi kartı, banka kartı, havale/EFT ve kapıda ödeme seçeneklerini kabul ediyoruz. Tüm kredi kartlarına 9 aya kadar taksit imkanı sunuyoruz.',
      },
      {
        question: 'Kapıda ödeme yapabilir miyim?',
        answer:
          'Evet, kapıda nakit veya kredi kartı ile ödeme yapabilirsiniz. Kapıda ödeme seçeneğinde 10 TL hizmet bedeli eklenmektedir.',
      },
      {
        question: 'Fatura nasıl düzenlenir?',
        answer:
          'Faturanız sipariş sırasında verdiğiniz bilgiler doğrultusunda düzenlenir ve ürünle birlikte gönderilir. Kurumsal fatura için sipariş sırasında firma bilgilerinizi ekleyebilirsiniz.',
      },
    ],
  },
  {
    category: 'İade ve Değişim',
    questions: [
      {
        question: 'İade ve değişim koşulları nelerdir?',
        answer:
          'Ürünlerinizi teslim aldığınız tarihten itibaren 14 gün içinde iade edebilir veya değiştirebilirsiniz. Ürünlerin kullanılmamış, etiketli ve orijinal ambalajında olması gerekmektedir.',
      },
      {
        question: 'İade işlemi nasıl yapılır?',
        answer:
          'İade talebinizi "Hesabım" sayfasından veya müşteri hizmetlerimizi arayarak oluşturabilirsiniz. Onay sonrası size gönderilen kargo kodu ile ürünü ücretsiz gönderebilirsiniz.',
      },
      {
        question: 'İade ücretini kim karşılıyor?',
        answer:
          'Ayıplı veya hatalı ürün iadelerinde kargo ücreti tarafımızca karşılanır. Müşteri kaynaklı iadelerde kargo ücreti müşteriye aittir.',
      },
      {
        question: 'İade tutarım ne zaman yatar?',
        answer:
          'İade edilen ürün tarafımıza ulaştıktan ve kontrol edildikten sonra 3-5 iş günü içinde ödemeniz iade edilir. Kredi kartı ödemelerinde süre bankanıza göre değişebilir.',
      },
    ],
  },
  {
    category: 'Ürünler',
    questions: [
      {
        question: 'Ürünler orijinal mi?',
        answer:
          'Evet, tüm ürünlerimiz orijinal ve yetkili distribütörlerden temin edilmektedir. Her ürün garanti kapsamındadır.',
      },
      {
        question: 'Beden tablosuna nasıl ulaşabilirim?',
        answer:
          'Her ürün sayfasında "Beden Tablosu" butonu bulunmaktadır. Bu butona tıklayarak detaylı ölçü bilgilerine ulaşabilirsiniz.',
      },
      {
        question: 'Stokta olmayan ürünler tekrar gelecek mi?',
        answer:
          'Stokta olmayan ürünler için "Stok Uyarısı Al" butonuna tıklayarak e-posta adresinizi bırakabilirsiniz. Ürün stoğa girdiğinde size bildirim gönderilecektir.',
      },
    ],
  },
  {
    category: 'Hesap ve Güvenlik',
    questions: [
      {
        question: 'Şifremi unuttum, ne yapmalıyım?',
        answer:
          'Giriş sayfasındaki "Şifremi Unuttum" linkine tıklayarak e-posta adresinize şifre sıfırlama bağlantısı gönderebilirsiniz.',
      },
      {
        question: 'Kişisel bilgilerim güvende mi?',
        answer:
          'Evet, tüm kişisel bilgileriniz SSL sertifikası ile şifrelenmekte ve KVKK kapsamında güvenle saklanmaktadır. Bilgileriniz hiçbir şekilde üçüncü şahıslarla paylaşılmaz.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#1C2840] mb-4">Sık Sorulan Sorular</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Aşağıda en çok merak edilen soruların cevaplarını bulabilirsiniz. Başka sorularınız için iletişim sayfamızdan bize ulaşabilirsiniz.
        </p>
      </div>

      {/* FAQ Sections */}
      <div className="max-w-3xl mx-auto space-y-8">
        {faqs.map((section, index) => (
          <div key={index}>
            <h2 className="text-xl font-bold text-[#1C2840] mb-4 pb-2 border-b">
              {section.category}
            </h2>
            <Accordion type="single" collapsible className="space-y-2">
              {section.questions.map((faq, faqIndex) => (
                <AccordionItem
                  key={faqIndex}
                  value={`item-${index}-${faqIndex}`}
                  className="border rounded-lg px-4"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    <span className="text-[#1C2840] font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="mt-12 text-center bg-[#1C2840] text-white rounded-lg p-8">
        <h3 className="text-2xl font-bold mb-4">Sorunuzu bulamadınız mı?</h3>
        <p className="text-gray-300 mb-6">
          Müşteri hizmetlerimiz size yardımcı olmaktan mutluluk duyacaktır.
        </p>
        <a
          href="/iletisim"
          className="inline-block bg-[#BB1624] hover:bg-[#8F101B] text-white px-6 py-3 rounded-lg font-medium transition"
        >
          Bize Ulaşın
        </a>
      </div>
    </div>
  )
}
