# Medical Appointment Booking

Hệ thống đặt lịch khám bệnh trực tuyến cho phép người dùng đặt lịch với bác sĩ, quản lý chuyên khoa và hạn chế trùng lịch thông qua cơ chế kiểm tra khung giờ.

## Công nghệ sử dụng

Backend:
- .NET 8 (ASP.NET Core Web API)
- Entity Framework Core
- SQL Server
- JWT Authentication (RBAC)
- Docker

Frontend:
- React
- Vite
- Docker
- Nginx

## Cấu trúc dự án

MedicalAppointmentBooking/
- MedicalAppointmentBooking.Web/        Frontend (React + Vite)
- src/
  - MedicalAppointmentBooking.Api/      Backend API
- docker-compose.yml

## Kiến trúc Backend

Backend được tổ chức theo mô hình phân lớp:

- Controllers: Định nghĩa API endpoint
- DTOs: Model request/response
- Data: DbContext và cấu hình database
- Repositories: Tầng truy cập dữ liệu
- Services: Xử lý logic nghiệp vụ
- Security/Jwt: Xác thực JWT
- Middleware: Middleware tùy chỉnh
- Migrations: Migration của Entity Framework Core
- wwwroot/uploads: Lưu trữ file upload

## Tính năng chính

- Quản lý thông tin bác sĩ
- Quản lý danh mục chuyên khoa
- Đặt lịch khám bệnh
- Kiểm tra và ngăn chặn trùng lịch (double-booking)
- Xác thực và phân quyền người dùng bằng JWT và RBAC
- Upload và phục vụ hình ảnh bác sĩ
- Tối ưu truy vấn dữ liệu với Entity Framework Core
- Chạy toàn bộ hệ thống bằng Docker Compose

## Hướng dẫn chạy dự án

Yêu cầu:
- Docker
- Docker Compose

Chạy hệ thống:

docker-compose up --build

## Các service mặc định

- Frontend: http://localhost:3000
- Backend API: http://localhost:5169
- SQL Server: localhost:1434

## Cấu hình môi trường


Cập nhật các giá trị trong file appsettings.json:

{
  "ConnectionStrings": {
    "DefaultConnection": "YOUR_CONNECTION_STRING"
  },
  "Jwt": {
    "Key": "YOUR_SECRET_KEY"
  }
}

## Điểm nổi bật kỹ thuật

- Xây dựng RESTful API cho hệ thống đặt lịch khám bệnh
- Triển khai cơ chế kiểm tra xung đột lịch hẹn
- Áp dụng phân quyền RBAC với JWT
- Tổ chức code theo kiến trúc Controller - Service - Repository
- Sử dụng Entity Framework Core để quản lý dữ liệu và migration
- Đóng gói toàn bộ hệ thống bằng Docker

## Kết quả

Hệ thống hoạt động ổn định, hỗ trợ đặt lịch hiệu quả, giảm thiểu xung đột lịch và cải thiện quy trình vận hành.

## Repository

https://github.com/hwang2501/MedicalAppointmentBooking

## Tác giả

https://github.com/hwang2501
