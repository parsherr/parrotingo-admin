# Parrotingo Admin - Veri Yönetimi ve Mimari Analizi

Bu belge, **parrotingo-admin** projesinin arka plan veri akışını, Frontend (Yönetim Paneli) üzerinde yapılan işlemlerin veritabanına nasıl kaydedildiğini ve uygulamanın depolama (storage) mimarisini detaylandırmaktadır.

## 1. Proje Genel Bakışı ve "Headless CMS" Mimarisi

**parrotingo-admin**, Next.js (App Router) ile geliştirilmiş bir yönetim panelidir. Bu projenin en dikkat çekici özelliği, **geleneksel bir veritabanı (PostgreSQL, MongoDB vb.) kullanmamasıdır**.

Bunun yerine sistem, **GitHub'ı bir veritabanı gibi kullanır**. Veriler `.json` dosyaları halinde bir GitHub reposunda tutulur ve işlemler GitHub REST API (Octokit) üzerinden doğrudan repoya commit atılarak gerçekleştirilir.

## 2. Frontend'de Hangi İşlem, Hangi Veriyi Yazıyor?

Kullanıcı arayüzünde yapılan işlemler Next.js'in **Server Actions** (`src/app/actions.ts`) yapısı ile arka uca iletilir. Yapılan eyleme göre veriler şu şekilde şekillenir ve kaydedilir:

### A. Kelime (Word) İşlemleri
Yönetici panelinden yeni bir kelime eklendiğinde veya var olan düzenlendiğinde (`createWordAction` / `updateWordAction`):
- `nanoid` kullanılarak kelimeye eşsiz bir ID oluşturulur.
- Hedef Dosya: **`data/words.json`**
- Var olan kelime listesi okunur, yeni kelime bu listeye eklenir (veya güncellenir) ve dosyanın tümü tekrar GitHub'a commitlenir.

### B. Ünite (Unit) İşlemleri
Yeni bir ünite eklendiğinde (`createUnitAction`):
- Üniteye başlık (title) ve sıra (order) verilir. Başlangıçta boş bir `wordIds: []` dizisi atanır.
- Hedef Dosya: **`data/units.json`**
- Kelimeler belirli bir üniteye atandığında, o ünitenin `wordIds` dizisi içerisine kelimenin ID'si yazılır ve dosya güncellenir.

### C. Soru (Question) İşlemleri
Bir kelimenin içine girilip ona soru eklendiğinde (boşluk doldurma veya eşleştirme) (`saveWordQuestionAction`):
- Hedef Dosya: **`data/word_questions.json`**
- Bu dosya bir sözlük (Map/Object) yapısındadır. Anahtar (key) olarak kelimenin ID'sini, değer (value) olarak ise o kelimeye ait soruların dizisini tutar (Örn: `{"kelime-id": [soru1, soru2]}`).
- İlgili kelime ID'sinin dizisine yeni soru nesnesi eklenir ve JSON dosyası güncellenir.
- *(Ayrıca ünite sonu değerlendirmeleri için `data/unit_questions.json` dosyası da benzer mantıkta `saveUnitQuestionAction` ile güncellenmektedir.)*

Tüm bu işlemler sonrasında `revalidatePath("/dashboard")` çağrılarak Next.js'in sunucu önbelleği (cache) temizlenir ve arayüzdeki tablolar anında güncel veriyi gösterir.

## 3. Veri Kaydetme (Storage) Mekanizması Nasıl Çalışıyor?

Tüm veri okuma ve yazma işlemleri **`src/lib/storage.ts`** dosyasındaki çekirdek fonksiyonlar tarafından yürütülür:

1. **Octokit Entegrasyonu:** `.env` dosyasından alınan `GITHUB_TOKEN`, `GITHUB_OWNER` ve `GITHUB_REPO` bilgileri ile GitHub API bağlantısı kurulur.
2. **Yazma İşlemi (Commit Atma):**
   - Frontend'den gelen veri nesnesi, `JSON.stringify` ile JSON formatında metne dönüştürülür.
   - Bu metin Base64 formatına çevrilir.
   - `octokit.repos.createOrUpdateFileContents` fonksiyonu kullanılarak dosya doğrudan GitHub reposuna `"Update dictionary words"` gibi otomatik mesajlarla commitlenir. API, çakışmaları (conflict) önlemek için dosyanın son `sha` değerini de kullanır.
3. **Local Geliştirme (Dev Mode) Desteği:** 
   - Eğer geliştirme ortamındaysak (`NODE_ENV === "development"`), GitHub'a atılan commit'in yanı sıra `fs.writeFile` ile makinenin **lokal `data/` klasörüne de** `.json` dosyaları fiziksel olarak yazılır. Okuma işlemlerinde ise önce lokale, bulunamazsa GitHub'a bakılır.

## 4. İstemci (Demo Frontend) Bu Veriyi Nasıl Alıyor?

Parrotingo Demo (oyun arayüzü) uygulaması çalıştığında, bu yönetim panelinin barındırdığı `/api/curriculum` API ucuna bir istek atar. Bu istek **`src/app/api/curriculum/route.ts`** dosyasında karşılanır:

1. Sistem aynı anda (`Promise.all` ile paralel olarak);
   - `getUnits()` ile `data/units.json`'ı,
   - `getWords()` ile `data/words.json`'ı,
   - `getWordQuestions()` ile `data/word_questions.json`'ı,
   - `getUnitQuestions()` ile `data/unit_questions.json`'ı okur.
2. Gelen tüm bu ayrı JSON dosyalarındaki nesneleri tek bir büyük JSON objesi (payload) olarak birleştirir ve Demo uygulamasına gönderir.
3. Böylece Demo uygulaması kendi içinde hiçbir veritabanı veya state yönetimine ihtiyaç duymadan, Admin panelinden GitHub'a yazılan bu birleşik müfredatı kullanarak bölümleri render eder.
