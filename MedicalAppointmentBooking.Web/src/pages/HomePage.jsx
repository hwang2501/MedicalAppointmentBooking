import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { apiRequest } from '../api/apiClient';

export default function HomePage() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    apiRequest('/api/doctors', {})
      .then(data => setDoctors(data.slice(0, 3))) // Show top 3 doctors
      .catch(err => console.error("Could not load doctors:", err));
  }, []);

  return (
    <div className="home-page">
      {/* 🌟 HERO SECTION */}
      <section className="premium-hero">
        <div className="hero-blur-circle top-right"></div>
        <div className="hero-blur-circle bottom-left"></div>
        
        <div className="premium-hero-content fade-in-up">
          <span className="hero-badge">Ứng dụng chuẩn y tế thế hệ mới</span>
          <h1>
            Chăm sóc sức khoẻ cao cấp tại <br />
            <span className="text-gradient">Đa Khoa Huỳnh Hoàng</span>
          </h1>
          <p className="hero-lead">
            Hệ thống đặt khám trực tuyến tiên tiến giúp bệnh nhân chủ động chọn chuyên gia,
            đặt khung giờ chính xác và theo dõi bệnh án hoàn toàn bảo mật.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-premium-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              <span>Đăng Nhập</span>
            </Link>
            <Link to="/register" className="btn btn-premium-ghost">
              Đăng Ký Tài Khoản
            </Link>
          </div>
        </div>
      </section>

      {/* ✨ KHÁM PHÁ DỊCH VỤ (FEATURES) */}
      <section className="premium-section fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="section-header">
          <h2>Dịch Vụ Nổi Bật</h2>
          <p className="muted">Trải nghiệm tiện ích y tế thông minh chỉ với vài thao tác.</p>
        </div>
        
        <div className="premium-grid-3">
          <div className="glass-card zoom-hover">
            <div className="glass-icon blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </div>
            <h3>Chuyên khoa hàng đầu</h3>
            <p className="muted">Hội tụ Nội Tim Mạch, Da Liễu, Nhi Khoa với các bác sĩ đầu ngành.</p>
          </div>
          
          <div className="glass-card zoom-hover">
            <div className="glass-icon green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h3>Khớp giờ chuẩn xác</h3>
            <p className="muted">Lịch khám được chia thành các slot cố định, đảm bảo không phải chờ đợi lâu.</p>
          </div>
          
          <div className="glass-card zoom-hover">
            <div className="glass-icon purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <h3>Quản lý hồ sơ số</h3>
            <p className="muted">Theo dõi, xét duyệt và huỷ lịch tức thời ngay trên hệ thống cá nhân.</p>
          </div>
        </div>
      </section>

      {/* 🌟 ĐỘI NGŨ CHUYÊN GIA DỰ KIẾN (DUMMY SECTION) */}
      <section className="premium-section fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="section-header">
          <h2>Đội ngũ chuyên gia</h2>
          <p className="muted">Khám chữa bệnh bởi các bác sĩ tận tâm, giàu kinh nghiệm.</p>
        </div>
        <div className="doctors-preview-grid">
           {doctors.length > 0 ? doctors.map((doc) => (
              <div key={doc.id} className="doctor-elite-card">
                 <div className="doctor-avatar-wrapper" style={{background: doc.imageUrl ? 'transparent' : 'linear-gradient(135deg, #14b8a6, #3b82f6)'}}>
                    {doc.imageUrl ? (
                       <img src={doc.imageUrl} alt={doc.name} style={{width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '4px solid #fff', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} />
                    ) : (
                       <div className="doctor-avatar-placeholder">
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                       </div>
                    )}
                 </div>
                 <div className="doctor-info">
                   <h4>{doc.name}</h4>
                   <span className="doctor-specialty-badge">{doc.specialtyName}</span>
                 </div>
              </div>
           )) : <p className="muted" style={{textAlign: 'center', gridColumn: '1 / -1'}}>Đang cập nhật danh sách bác sĩ...</p>}
        </div>
      </section>

      {/* 🚀 CÁC BƯỚC ĐẶT LỊCH */}
      <section className="premium-section step-section fade-in-up" style={{ animationDelay: '0.3s' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 40 }}>Quy trình Tối ưu</h2>
        <div className="steps-container">
          <div className="step-item">
            <div className="step-number">1</div>
            <h4>Tạo tài khoản</h4>
            <p>Đăng ký định danh nhanh.</p>
          </div>
          <div className="step-line"></div>
          <div className="step-item">
            <div className="step-number">2</div>
            <h4>Chọn bác sĩ</h4>
            <p>Tìm bác sĩ & khung giờ khớp.</p>
          </div>
          <div className="step-line"></div>
          <div className="step-item">
            <div className="step-number">3</div>
            <h4>Đến khám</h4>
            <p>Xác nhận và tới phòng khám.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

