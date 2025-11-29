Bu projeyi, kullanıcıların farklı yapay zeka modelleriyle etkileşim kurabileceği, geçmiş sohbetlerini saklayabileceği ve arka plandaki tüm işlemlerin izlenebildiği modern bir full-stack uygulama olarak geliştirdim.

Backend: Node.js & Express (TypeScript)

Sohbet uygulamasının yüksek I/O ihtiyacını Node.js'in asenkron yapısıyla karşıladım. Chat Create gibi işlemlerde veri bütünlüğünü korumak ve runtime hatalarını önlemek için projeyi TS ile yazdım. Kodun okunabilirliği için MVC mimarisini uyguladım.

Frontend: React & Vite

Arayüzü modüler parçalara (Header, MessageList vb.) bölerek yönetilebilir kılmak için React'i tercih ettim. Hızlı derleme süreleri sunduğu için Vite kullandım.

Veritabanı: MongoDB

Sohbet verilerinin (JSON) yapısına en uygun veritabanı olduğu için MongoDB'yi seçtim. Şemasız yapısı sayesinde veri modelini esnek tutabildim.

OpenTelemetry & Jaeger

Dağıtık bir sistemde hatanın kaynağını (API mı yavaş, veritabanı mı?) bulmak zordur. Bu yüzden her isteği "trace" ederek Jaeger üzerinde görselleştirebiliriz.

Projeyi Çalıştırma Adımları:

Gereksinimler: Docker Desktop, Node.js v18+, OpenRouter API Key

docker-compose up -d

Backend Kurulumu:

cd backend
npm install

Note: src/services/openaiService.ts dosyasına gidip OPENROUTER_API_KEY alanına API anahtarınızı yapıştırın.

npm run dev

Frontend Kurulumu

cd frontend
npm install
npm run dev

Uygulama http://localhost:5173 adresinde olacak.

Trace verilerini görüntüleyebilirsiniz:

Case study'nin izleme sistemini test etmek için:

Uygulamadan bir mesaj gönderin

http://localhost:16686 adresindeki Jaeger paneline gidin.

Service kısmından chat-backend-service seçeneğini işaretleyip Find Traces butonuna basın.

Burada; yapay zeka servisine gidiş süresini (openrouter_api_call) ve veritabanı yazma süresini (mongodb) detaylı grafiklerle görebilirsiniz.
