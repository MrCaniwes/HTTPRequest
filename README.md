# ⚡ API Cockpit Studio

> **Native CORS-Free REST & API Testing Cockpit** — .NET Framework, WPF & Edge WebView2 ile geliştirilmiş fütüristik, ultra-karanlık temalı masaüstü API test istemcisi.

![Platform](https://img.shields.io/badge/Platform-Windows-blue?style=for-the-badge&logo=windows)
![.NET Framework](https://img.shields.io/badge/.NET_Framework-4.7.2-purple?style=for-the-badge&logo=dotnet)
![WebView2](https://img.shields.io/badge/Engine-Microsoft_WebView2-00F5D4?style=for-the-badge&logo=microsoftedge)
![UI](https://img.shields.io/badge/UI-Cyber_Cockpit-7928CA?style=for-the-badge)

---

## 🌟 Öne Çıkan Özellikler

* **🚀 Zero-CORS Native Engine:** İstekler tarayıcı içinden değil, arka plandaki C# `HttpClient` üzerinden çalışır. Bu sayede **tarayıcıların CORS (Cross-Origin Resource Sharing) kısıtlamalarına takılmadan** yerel veya uzak tüm API'lere tam yetkili istek gönderilebilir.
* **🎯 Segmentli Hızlı Metot Seçimi:** Açılır kutular olmadan tek tıkla `GET`, `POST`, `PUT`, `DELETE` ve `PATCH` metotları arasında geçiş.
* **🔑 Gelişmiş Yetkilendirme (Auth Engine):**
  * **Bearer Token (JWT / OAuth):** Panodan tek tıkla yapıştırma ve otomatik `Authorization: Bearer <token>` ekleme.
  * **API Key:** Özel Header adı ve değeri yapılandırması.
  * **Basic Auth:** Kullanıcı adı ve şifreyi otomatik Base64 formatına çevirerek `Authorization: Basic <base64>` ekleme.
* **📊 Hologram HUD Dashboard:**
  * Büyük neon durum rozeti (2xx Başarılı, 3xx Yönlendirme, 4xx/5xx Hata).
  * Milisaniye cinsinden canlı gecikme süresi (`⚡ ms`).
  * Yanıt veri boyutu (`📦 KB`).
* **📜 Yerel İstek Geçmişi (Slide-Over Drawer):** Gönderilen tüm istekleri otomatik hafızaya alır. Geçmiş çekmecesinden tek tıkla önceki isteğe ve verilerine anında geri dönülebilir.
* **✨ Renkli JSON Sözdizimi & Satır Numaralandırma:** Gelen JSON verilerini otomatik formatlar (Prettify) ve anahtar/değer renklendirmesiyle sunar. Kod ile senkronize kayan dikey satır numaraları içerir.
* **💾 Dışa Aktarma & Kopyalama:** Yanıtı tek tıkla panoya kopyalama veya `.json` dosyası olarak bilgisayara kaydetme.
* **🖤 Kenarlıksız Özel Pencere (Frameless Custom Chrome):** Windows'un standart beyaz başlık çubuğu kaldırılarak uygulamanın neon temasıyla bütünleşik özel başlık çubuğu (`WindowChrome`).

---

## 🛠️ Teknolojiler & Mimari

| Katman | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Ana Çatı** | .NET Framework 4.7.2 (WPF) | Yüksek performanslı masaüstü pencere yönetimi |
| **Web Motoru** | Microsoft Edge WebView2 | Modern web arayüzünü izole ve güvenli render etme |
| **HTTP Motoru** | `System.Net.Http.HttpClient` | Yerel, yüksek performanslı ve CORS'suz ağ istekleri |
| **Veri & Köprü** | Newtonsoft.Json + WebMessage | C# ve JavaScript arasında çift yönlü asenkron mesajlaşma |
| **Frontend** | HTML5, CSS3 (Glassmorphism / Neon), JS | Fütüristik 2 sütunlu kokpit arayüzü |

---

## 🚀 Kurulum & Çalıştırma

### Gereksinimler:
* Windows 10 / 11
* [Visual Studio 2022](https://visualstudio.microsoft.com/) (.NET masaüstü geliştirme iş yükü ile)
* [Microsoft Edge WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) (Windows 10/11'de genellikle yüklüdür)

### Adımlar:
1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/KULLANICI_ADINIZ/API-Cockpit-Studio.git
   ```
2. Çözüm dosyasını Visual Studio ile açın:
   * `HTTPRequest.slnx`
3. NuGet paketlerini geri yükleyin:
   * Projeye sağ tıklayıp **"NuGet Paketlerini Geri Yükle"** deyin.
4. **F5** tuşuna basarak projeyi derleyin ve çalıştırın.

---

## 📄 Lisans
Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.
