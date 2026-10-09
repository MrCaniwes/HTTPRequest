# ⚡ API Cockpit Studio

> **Native CORS-Free REST & HTTP Testing Cockpit** — A futuristic, ultra-dark themed desktop API development and testing studio powered by .NET Framework, WPF, and Microsoft Edge WebView2.

![Platform](https://img.shields.io/badge/Platform-Windows-blue?style=for-the-badge&logo=windows)
![.NET Framework](https://img.shields.io/badge/.NET_Framework-4.7.2-purple?style=for-the-badge&logo=dotnet)
![WebView2](https://img.shields.io/badge/Engine-Microsoft_WebView2-00F5D4?style=for-the-badge&logo=microsoftedge)
![UI](https://img.shields.io/badge/UI-Cyber_Cockpit-7928CA?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 🌟 Key Highlights

* **🚀 Zero-CORS Native Engine:** Network requests bypass the browser's sandbox and run directly through C#'s native `HttpClient`. This completely eliminates **CORS (Cross-Origin Resource Sharing) restrictions**, allowing full-authority requests to any local, intranet, or remote API endpoint.
* **🎯 Segmented Fast Method Bar:** No clunky dropdowns — switch between `GET`, `POST`, `PUT`, `DELETE`, and `PATCH` with a single click using neon-coded cyber segments.
* **🔑 Advanced Authentication Hub:**
  * **Bearer Token (JWT / OAuth):** Instant one-click paste from clipboard with automatic `Authorization: Bearer <token>` injection.
  * **API Key:** Configure custom header keys and values effortlessly.
  * **Basic Auth:** Auto Base64 encoding into `Authorization: Basic <base64>`.
* **📊 Hologram HUD Dashboard:**
  * Large status code badge (`200 OK`, `404`, `500`) with dynamic glowing aura.
  * Real-time millisecond latency tracker (`⚡ ms`).
  * Response payload size monitor (`📦 KB`).
* **📜 Slide-Over History Drawer:** Automatically saves all executed requests. Click any past request in the drawer to instantly restore its URL, method, headers, tokens, and body into the Request Forge.
* **✨ Colorized Syntax Highlighting & Line Numbers:** Auto-formats (prettifies) JSON responses with VS Code-grade syntax coloring and synchronized vertical line numbers.
* **💾 Export & One-Click Copy:** Copy raw or formatted responses to the clipboard with animated confirmation, or download them directly as `.json` files.
* **🖤 Frameless Cyber Title Bar:** Replaces the standard Windows white title bar with a custom, sleek dark title bar (`WindowChrome`) supporting native dragging, minimizing, maximizing, and resizing.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Desktop Host** | .NET Framework 4.7.2 (WPF) | High-performance Windows desktop shell & frameless chrome |
| **Web Runtime** | Microsoft Edge WebView2 | Secure, modern Chromium-based UI presentation layer |
| **HTTP Engine** | `System.Net.Http.HttpClient` | High-throughput, native, zero-CORS networking core |
| **IPC Bridge** | Newtonsoft.Json + WebMessage | Bidirectional async communication between C# and JavaScript |
| **Frontend UI** | HTML5, CSS3 (Glassmorphism / Neon), JS | Two-column split cyber cockpit workspace |

---

## 🚀 Getting Started

### Prerequisites:
* Windows 10 or 11
* [Visual Studio 2022](https://visualstudio.microsoft.com/) (.NET desktop development workload)
* [Microsoft Edge WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) (Pre-installed on modern Windows 10/11)

### Installation:
1. Clone the repository:
   ```bash
   git clone https://github.com/MrCaniwes/HTTPRequest.git
   ```
2. Open the solution in Visual Studio:
   * `HTTPRequest.slnx`
3. Restore NuGet Packages:
   * Right-click the solution in Visual Studio and select **Restore NuGet Packages**.
4. Press **F5** to build and run the application.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE.txt).
