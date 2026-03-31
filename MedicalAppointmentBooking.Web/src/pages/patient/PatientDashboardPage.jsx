import { Link } from 'react-router-dom';

export default function PatientDashboardPage() {
  return (
    <div className="page">
      <h2>Trang tổng quan bệnh nhân</h2>
      <p className="page-lead">Chào mừng bạn quay lại. Bắt đầu đặt lịch hoặc theo dõi lịch hiện có.</p>

      <div className="grid-3">
        <div className="card card-soft">
          <h3>Tìm bác sĩ</h3>
          <p className="muted">Lọc theo tên hoặc chuyên khoa để chọn bác sĩ phù hợp.</p>
          <Link to="/doctors" className="btn btn-primary">Đi đến đặt lịch</Link>
        </div>
        <div className="card card-soft">
          <h3>Lịch của tôi</h3>
          <p className="muted">Xem lịch đã đặt, trạng thái xác nhận và hủy khi cần.</p>
          <Link to="/appointments/me" className="btn">Xem lịch hẹn</Link>
        </div>
        <div className="card card-soft">
          <h3>Hướng dẫn nhanh</h3>
          <p className="muted">Chỉ chọn khung giờ còn trống để tránh trùng lịch bác sĩ.</p>
          <span className="nav-badge">An toàn · Minh bạch</span>
        </div>
      </div>
    </div>
  );
}

