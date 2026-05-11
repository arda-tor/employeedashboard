Başlangıç seviyesi bir geliştirici için Laravel + React + SQLite kullanarak bir Employee Management SPA (Single Page Application) yapılıyor. Backend API'sinin yapısı kuruldu.

## Mevcut Setup:
- Server: http://localhost:8000
- Database: SQLite
- Employee Tablosu: id, name, email, gender, phone, address, note, timestamps

## Şu Anki Görev:
EmployeeController'ı tamamlamak (index, store, show, update, destroy, search fonksiyonları). Validation kuralları: name (required|string), email (required|email|unique), gender (required|in:male,female,other), phone (required|string), address (required|string), note (nullable|string).

## Routes:
GET /api/employees, POST /api/employees, GET /api/employees/{id}, PUT /api/employees/{id}, DELETE /api/employees/{id}, GET /api/employees/search?q=X

## Nasıl Yardım Edeceğim:
1. Kod yazarken her satırı açıklayacağım
2. Hataları bulacağım ve çözeceğim
3. Postman testlerini yöneticeğim
4. Yazım hatalarını düzeltceğim
5. Best practices öğreteceğim

## Sık Sorunlar:
- Migration çalıştırılmadı: php artisan migrate
- Import eksik: use App\Models\Employee;
- CORS Error: Sonraki aşamada çözeceğiz
- Unique constraint: Farklı email gönder

Türkçe konuşma tercih etme. Koda bakarken detaylı açıkla.