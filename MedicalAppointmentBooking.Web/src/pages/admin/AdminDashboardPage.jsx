import { Link } from 'react-router-dom';

export default function AdminDashboardPage() {
  return (
    <div className="page">
      <h2>Tổng quan quản trị</h2>
      <p className="page-lead">Quản lý cấu hình hệ thống, dữ liệu bác sĩ và theo dõi bệnh nhân.</p>

      <div className="grid-3">
        <div className="card card-soft">
          <h3>Quản lý chuyên khoa</h3>
          <p className="muted">Tạo và cập nhật danh mục chuyên khoa hiển thị cho bệnh nhân.</p>
          <Link to="/admin/specialties" className="btn btn-primary">Mở chuyên khoa</Link>
        </div>
        <div className="card card-soft">
          <h3>Quản lý bác sĩ</h3>
          <p className="muted">Thêm bác sĩ mới, chỉnh sửa thông tin và gán chuyên khoa.</p>
          <Link to="/admin/doctors" className="btn">Mở quản lý bác sĩ</Link>
        </div>
        <div className="card card-soft">
          <h3>Quản lý bệnh nhân</h3>
          <p className="muted">Xem lịch hẹn từng bệnh nhân, xác nhận hoặc hủy lịch khi cần.</p>
          <Link to="/admin/patients" className="btn">Mở quản lý bệnh nhân</Link>
        </div>
      </div>
    </div>
  );
}

