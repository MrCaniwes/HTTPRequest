using System;
using System.Diagnostics;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using Microsoft.Web.WebView2.Core;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace HTTPRequest
{
    /// <summary>
    /// MainWindow.xaml etkileşim mantığı - WebView2 Tabanlı REST İstemcisi
    /// </summary>
    public partial class MainWindow : Window
    {
        private static readonly HttpClient httpClient = new HttpClient();
        private const string VirtualHostDomain = "app.httprequest";
        private const string VirtualHostUrl = "https://" + VirtualHostDomain + "/";

        public MainWindow()
        {
            InitializeComponent();
            Loaded += async (s, e) => await InitializeWebViewAsync();

            StateChanged += (s, e) =>
            {
                if (BtnMaximize != null)
                {
                    BtnMaximize.Content = (WindowState == WindowState.Maximized) ? "❐" : "▢";
                }
            };
        }

        #region Özel Başlık Çubuğu Olayları (Custom TitleBar)

        private void BtnMinimize_Click(object sender, RoutedEventArgs e)
        {
            WindowState = WindowState.Minimized;
        }

        private void BtnMaximize_Click(object sender, RoutedEventArgs e)
        {
            if (WindowState == WindowState.Maximized)
            {
                WindowState = WindowState.Normal;
                BtnMaximize.Content = "▢";
            }
            else
            {
                WindowState = WindowState.Maximized;
                BtnMaximize.Content = "❐";
            }
        }

        private void BtnClose_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }

        #endregion

        private async Task InitializeWebViewAsync()
        {
            try
            {
                string userDataFolder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "HTTPRequest_WebViewData");
                var env = await CoreWebView2Environment.CreateAsync(null, userDataFolder);

                await webView.EnsureCoreWebView2Async(env);

                webView.CoreWebView2.Settings.AreDefaultContextMenusEnabled = true;
                webView.CoreWebView2.Settings.AreDevToolsEnabled = true;

                // Sanal host filtresi ekle
                webView.CoreWebView2.AddWebResourceRequestedFilter($"{VirtualHostUrl}*", CoreWebView2WebResourceContext.All);
                webView.CoreWebView2.WebResourceRequested += CoreWebView2_WebResourceRequested;

                // Sayfa yükleme bittiğinde loading ekranını kaldır
                webView.NavigationCompleted += (s, e) =>
                {
                    if (LoadingOverlay != null)
                    {
                        LoadingOverlay.Visibility = Visibility.Collapsed;
                    }
                };

                // Ana web arayüzünü aç
                webView.CoreWebView2.Navigate($"{VirtualHostUrl}index.html");
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"WebView2 Başlatma Hatası: {ex.Message}");
                MessageBox.Show($"WebView2 başlatılırken bir hata oluştu:\n{ex.Message}\n\nLütfen sisteminizde Microsoft Edge WebView2 Runtime'ın kurulu olduğundan emin olun.",
                                "WebView2 Hatası", MessageBoxButton.OK, MessageBoxImage.Error);

                if (LoadingOverlay != null)
                {
                    LoadingOverlay.Visibility = Visibility.Collapsed;
                }
            }
        }

        private void CoreWebView2_WebResourceRequested(object sender, CoreWebView2WebResourceRequestedEventArgs e)
        {
            try
            {
                string uri = e.Request.Uri;
                if (uri.StartsWith(VirtualHostUrl, StringComparison.OrdinalIgnoreCase))
                {
                    string fileName = uri.Substring(VirtualHostUrl.Length);
                    if (string.IsNullOrEmpty(fileName) || fileName == "/")
                    {
                        fileName = "index.html";
                    }

                    // Soru işareti / query parametresi varsa temizle
                    int queryIdx = fileName.IndexOf('?');
                    if (queryIdx >= 0) fileName = fileName.Substring(0, queryIdx);

                    Stream stream = FindResourceStream(fileName);
                    if (stream != null)
                    {
                        string contentType = GetContentType(fileName);
                        e.Response = webView.CoreWebView2.Environment.CreateWebResourceResponse(
                            stream, 200, "OK", $"Content-Type: {contentType}\r\nAccess-Control-Allow-Origin: *");
                        return;
                    }

                    e.Response = webView.CoreWebView2.Environment.CreateWebResourceResponse(null, 404, "Not Found", "");
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"WebResourceRequested Hatası: {ex.Message}");
            }
        }

        /// <summary>
        /// Önce dosya sisteminden (WebUI klasörü), bulunamazsa Assembly Manifest (Embedded) kaynaklarından arar.
        /// </summary>
        private Stream FindResourceStream(string fileName)
        {
            string baseDir = AppDomain.CurrentDomain.BaseDirectory;

            // 1. Visual Studio geliştirme aşamasında proje dizinini kontrol et (bin\Debug -> ..\..\WebUI)
            string projectWebUi = Path.GetFullPath(Path.Combine(baseDir, @"..\..\WebUI", fileName));
            if (File.Exists(projectWebUi))
            {
                return File.OpenRead(projectWebUi);
            }

            // 2. Çalışma dizini altındaki WebUI klasörünü kontrol et (Release / Dağıtım)
            string localPath = Path.Combine(baseDir, "WebUI", fileName);
            if (File.Exists(localPath))
            {
                return File.OpenRead(localPath);
            }

            // 3. Assembly Embedded Resource'ları kontrol et
            var assembly = Assembly.GetExecutingAssembly();
            string[] resources = assembly.GetManifestResourceNames();
            string resourcePath = Array.Find(resources, r => r.EndsWith("." + fileName, StringComparison.OrdinalIgnoreCase) ||
                                                             r.IndexOf(fileName, StringComparison.OrdinalIgnoreCase) >= 0);

            if (resourcePath != null)
            {
                return assembly.GetManifestResourceStream(resourcePath);
            }

            return null;
        }

        private string GetContentType(string fileName)
        {
            string ext = Path.GetExtension(fileName).ToLowerInvariant();
            switch (ext)
            {
                case ".html": return "text/html; charset=utf-8";
                case ".css": return "text/css; charset=utf-8";
                case ".js": return "application/javascript; charset=utf-8";
                case ".json": return "application/json; charset=utf-8";
                case ".png": return "image/png";
                case ".jpg":
                case ".jpeg": return "image/jpeg";
                case ".svg": return "image/svg+xml";
                case ".ico": return "image/x-icon";
                default: return "application/octet-stream";
            }
        }

        #region C# & JS İletişim Köprüsü (WebMessageReceived)

        private async void webView_WebMessageReceived(object sender, CoreWebView2WebMessageReceivedEventArgs e)
        {
            try
            {
                string json = e.WebMessageAsJson;
                var msg = JsonConvert.DeserializeObject<JObject>(json);

                if (msg != null && msg["action"] != null)
                {
                    string action = msg["action"].ToString();
                    if (action == "send_request")
                    {
                        await HandleSendRequestAsync(msg);
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"WebMessageReceived Hatası: {ex.Message}");
            }
        }

        private async Task HandleSendRequestAsync(JObject data)
        {
            string method = data["method"]?.ToString() ?? "GET";
            string url = data["url"]?.ToString()?.Trim() ?? "";
            string authType = data["authType"]?.ToString() ?? "none";
            string token = data["token"]?.ToString()?.Trim() ?? "";
            string apiKeyName = data["apiKeyName"]?.ToString()?.Trim() ?? "";
            string apiKeyValue = data["apiKeyValue"]?.ToString()?.Trim() ?? "";
            string basicUser = data["basicUser"]?.ToString()?.Trim() ?? "";
            string basicPass = data["basicPass"]?.ToString() ?? "";
            string contentType = data["contentType"]?.ToString() ?? "application/json";
            string customHeaders = data["headers"]?.ToString() ?? "";
            string body = data["body"]?.ToString() ?? "";

            var stopwatch = Stopwatch.StartNew();

            try
            {
                HttpMethod httpMethod = ParseHttpMethod(method);

                using (var request = new HttpRequestMessage(httpMethod, url))
                {
                    // 1. Auth Bilgilerini Uygula
                    ApplyAuth(request, authType, token, apiKeyName, apiKeyValue, basicUser, basicPass);

                    // 2. Özel Headerları Uygula
                    ApplyHeaders(request, customHeaders);

                    // 3. Body (Gövde) Ekle
                    if (httpMethod != HttpMethod.Get && httpMethod != HttpMethod.Head && !string.IsNullOrEmpty(body))
                    {
                        request.Content = new StringContent(body, Encoding.UTF8, contentType);
                    }

                    // 4. İsteği Gönder (CORS sınırlarına takılmadan yerel C# HttpClient üzerinden atılır)
                    using (HttpResponseMessage response = await httpClient.SendAsync(request))
                    {
                        stopwatch.Stop();
                        long elapsedMs = stopwatch.ElapsedMilliseconds;

                        string responseBody = await response.Content.ReadAsStringAsync();
                        long byteSize = Encoding.UTF8.GetByteCount(responseBody);

                        // Başlıkları Formatla
                        var sbHeaders = new StringBuilder();
                        foreach (var header in response.Headers)
                        {
                            sbHeaders.AppendLine($"{header.Key}: {string.Join(", ", header.Value)}");
                        }
                        if (response.Content?.Headers != null)
                        {
                            foreach (var header in response.Content.Headers)
                            {
                                sbHeaders.AppendLine($"{header.Key}: {string.Join(", ", header.Value)}");
                            }
                        }

                        int statusCode = (int)response.StatusCode;
                        string statusText = $"{statusCode} {response.ReasonPhrase}";

                        // Yanıtı JS tarafına ilet
                        var resultPayload = new
                        {
                            action = "response_received",
                            success = true,
                            statusCode = statusCode,
                            statusText = statusText,
                            elapsedMs = elapsedMs,
                            byteSize = byteSize,
                            formattedSize = FormatBytes(byteSize),
                            headers = sbHeaders.ToString().TrimEnd(),
                            body = responseBody
                        };

                        webView.CoreWebView2.PostWebMessageAsJson(JsonConvert.SerializeObject(resultPayload));
                    }
                }
            }
            catch (Exception ex)
            {
                stopwatch.Stop();

                var errorPayload = new
                {
                    action = "response_error",
                    success = false,
                    errorTitle = "Bağlantı Hatası",
                    errorMessage = ex.Message,
                    elapsedMs = stopwatch.ElapsedMilliseconds
                };

                webView.CoreWebView2.PostWebMessageAsJson(JsonConvert.SerializeObject(errorPayload));
            }
        }

        private HttpMethod ParseHttpMethod(string method)
        {
            switch (method.ToUpperInvariant())
            {
                case "GET": return HttpMethod.Get;
                case "POST": return HttpMethod.Post;
                case "PUT": return HttpMethod.Put;
                case "DELETE": return HttpMethod.Delete;
                case "HEAD": return HttpMethod.Head;
                case "PATCH": return new HttpMethod("PATCH");
                default: return HttpMethod.Get;
            }
        }

        private void ApplyAuth(HttpRequestMessage request, string authType, string token, string apiKeyName, string apiKeyValue, string basicUser, string basicPass)
        {
            if (authType == "bearer" && !string.IsNullOrEmpty(token))
            {
                if (token.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                {
                    token = token.Substring(7).Trim();
                }
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            }
            else if (authType == "apikey" && !string.IsNullOrEmpty(apiKeyName) && !string.IsNullOrEmpty(apiKeyValue))
            {
                request.Headers.TryAddWithoutValidation(apiKeyName, apiKeyValue);
            }
            else if (authType == "basic" && (!string.IsNullOrEmpty(basicUser) || !string.IsNullOrEmpty(basicPass)))
            {
                var bytes = Encoding.UTF8.GetBytes($"{basicUser}:{basicPass}");
                string base64 = Convert.ToBase64String(bytes);
                request.Headers.Authorization = new AuthenticationHeaderValue("Basic", base64);
            }
        }

        private void ApplyHeaders(HttpRequestMessage request, string headersText)
        {
            if (string.IsNullOrWhiteSpace(headersText)) return;

            var lines = headersText.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
            foreach (var line in lines)
            {
                int colonIndex = line.IndexOf(':');
                if (colonIndex > 0)
                {
                    string key = line.Substring(0, colonIndex).Trim();
                    string val = line.Substring(colonIndex + 1).Trim();
                    if (!string.IsNullOrEmpty(key))
                    {
                        request.Headers.TryAddWithoutValidation(key, val);
                    }
                }
            }
        }

        private string FormatBytes(long bytes)
        {
            if (bytes < 1024) return $"{bytes} B";
            if (bytes < 1024 * 1024) return $"{(bytes / 1024.0):F2} KB";
            return $"{(bytes / (1024.0 * 1024.0)):F2} MB";
        }

        #endregion
    }
}
